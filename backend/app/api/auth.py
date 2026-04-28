import logging
import secrets
from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

from app.core.cache import delete_key, get_str, set_str
from app.core.config import settings
from app.core.rate_limiter import rate_limit_dependency
from app.core.security import (
    create_access_token,
    decode_access_token,
    get_current_user,
    get_password_hash,
)
from app.db.session import get_db
from app.models import User, UserRole
from app.schemas.auth import LoginRequest, RegisterRequest, RegisterResponse, TokenResponse
from app.schemas.user import UserRead
from app.services.auth_service import authenticate_user, get_user_by_email, register_user
from app.services.email_service import send_password_reset_email, send_verification_email

router = APIRouter()

register_rate_limit = rate_limit_dependency(
    "auth:register",
    limit=settings.RATE_LIMIT_REGISTER_PER_WINDOW,
    window_seconds=settings.RATE_LIMIT_WINDOW_SECONDS,
)
login_rate_limit = rate_limit_dependency(
    "auth:login",
    limit=settings.RATE_LIMIT_LOGIN_PER_WINDOW,
    window_seconds=settings.RATE_LIMIT_WINDOW_SECONDS,
)


def _build_token_response(email: str) -> tuple[str, int]:
    expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(subject=email, expires_delta=expires_delta)
    return token, int(expires_delta.total_seconds())


# ---------------------------------------------------------------------------
# Email verification helpers
# ---------------------------------------------------------------------------

_EMAIL_VERIFICATION_SCOPE = "email-verification"
_EMAIL_VERIFICATION_EXPIRE_SECONDS = 24 * 60 * 60  # 24 hours
_REDIS_VERIFICATION_KEY_PREFIX = "email_verify:"


def _redis_verification_key(token: str) -> str:
    return f"{_REDIS_VERIFICATION_KEY_PREFIX}{token}"


def _generate_and_send_verification(email: str) -> None:
    """Create a one-time verification token, store it in Redis, and send the email."""
    verification_token = create_access_token(
        subject=email,
        expires_delta=timedelta(seconds=_EMAIL_VERIFICATION_EXPIRE_SECONDS),
        extra_claims={"scope": _EMAIL_VERIFICATION_SCOPE},
    )
    set_str(_redis_verification_key(verification_token), email, _EMAIL_VERIFICATION_EXPIRE_SECONDS)
    if settings.APP_ENV != "production":
        logger.debug("Email verification token for %s: %s", email, verification_token)
    send_verification_email(email, verification_token)


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(
    payload: RegisterRequest,
    db: Annotated[Session, Depends(get_db)],
    _rate_limit: None = Depends(register_rate_limit),
) -> RegisterResponse:
    existing_user = get_user_by_email(db, payload.email)
    if existing_user is not None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    try:
        register_user(db, payload.email, payload.password, UserRole.VISITOR)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        ) from exc

    _generate_and_send_verification(payload.email)

    return RegisterResponse(
        message="Registration successful. Please check your email to verify your account.",
    )


@router.post("/login", response_model=TokenResponse)
def login(
    payload: LoginRequest,
    db: Annotated[Session, Depends(get_db)],
    _rate_limit: None = Depends(login_rate_limit),
) -> TokenResponse:
    user = authenticate_user(db, payload.email, payload.password)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token, expires_in = _build_token_response(user.email)
    return TokenResponse(access_token=token, expires_in=expires_in)


@router.get("/me", response_model=UserRead)
def me(current_user: Annotated[User, Depends(get_current_user)]) -> UserRead:
    return UserRead.model_validate(current_user)


class VerifyEmailResponse(BaseModel):
    message: str


@router.get("/verify-email", response_model=VerifyEmailResponse)
def verify_email(
    token: Annotated[str, Query(min_length=1)],
    db: Annotated[Session, Depends(get_db)],
) -> VerifyEmailResponse:
    redis_key = _redis_verification_key(token)
    stored_email = get_str(redis_key)
    if stored_email is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token",
        )
    # Consume the token immediately (one-time use).
    delete_key(redis_key)

    # Validate JWT claims as a secondary defence.
    try:
        token_data = decode_access_token(token)
    except HTTPException as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token",
        ) from exc

    if token_data.get("scope") != _EMAIL_VERIFICATION_SCOPE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token scope"
        )

    email = token_data.get("sub")
    if not isinstance(email, str):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification token"
        )
    if not secrets.compare_digest(email.lower().strip(), stored_email.lower().strip()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid verification token"
        )

    user = get_user_by_email(db, email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found")

    user.email_verified = True
    db.commit()

    return VerifyEmailResponse(message="Email verified successfully. You can now log in.")


class ResendVerificationRequest(BaseModel):
    email: EmailStr


class ResendVerificationResponse(BaseModel):
    message: str


@router.post("/resend-verification", response_model=ResendVerificationResponse)
def resend_verification(
    payload: ResendVerificationRequest,
    db: Annotated[Session, Depends(get_db)],
) -> ResendVerificationResponse:
    user = get_user_by_email(db, payload.email)
    if user is not None and not user.email_verified:
        _generate_and_send_verification(payload.email)
    # Always return the same response to avoid user enumeration.
    return ResendVerificationResponse(
        message="If this email is registered and unverified, a new verification link will be sent.",
    )


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetRequestResponse(BaseModel):
    message: str


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str


_PASSWORD_RESET_SCOPE = "password-reset"
_PASSWORD_RESET_EXPIRE_SECONDS = 30 * 60  # 30 minutes
_REDIS_KEY_PREFIX = "pwd_reset:"


def _redis_reset_key(token: str) -> str:
    return f"{_REDIS_KEY_PREFIX}{token}"


@router.post("/request-password-reset", response_model=PasswordResetRequestResponse)
def request_password_reset(
    payload: PasswordResetRequest,
    db: Annotated[Session, Depends(get_db)],
) -> PasswordResetRequestResponse:
    user = get_user_by_email(db, payload.email)
    if user is not None:
        reset_token = create_access_token(
            subject=payload.email,
            expires_delta=timedelta(seconds=_PASSWORD_RESET_EXPIRE_SECONDS),
            extra_claims={"scope": _PASSWORD_RESET_SCOPE},
        )
        # Store token in Redis as the authoritative one-time use record.
        set_str(_redis_reset_key(reset_token), payload.email, _PASSWORD_RESET_EXPIRE_SECONDS)
        # Deliver the link exclusively via email — the token is never returned in the response.
        send_password_reset_email(payload.email, reset_token)
    # Always return the same response to avoid user enumeration.
    return PasswordResetRequestResponse(
        message="If this email is registered, a reset link will be sent.",
    )


@router.post("/reset-password", response_model=TokenResponse)
def reset_password(
    payload: PasswordResetConfirm,
    db: Annotated[Session, Depends(get_db)],
) -> TokenResponse:
    redis_key = _redis_reset_key(payload.token)
    stored_email = get_str(redis_key)
    if stored_email is None:
        # Token is either expired, already used, or was never issued.
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token"
        )
    # Consume the token immediately — makes it a true one-time-use link.
    delete_key(redis_key)

    # Validate JWT claims as a secondary defence (e.g. tampered token).
    try:
        token_data = decode_access_token(payload.token)
    except HTTPException as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset token"
        ) from exc

    if token_data.get("scope") != _PASSWORD_RESET_SCOPE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token scope"
        )

    email = token_data.get("sub")
    if not isinstance(email, str):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset token"
        )
    if not secrets.compare_digest(email.lower().strip(), stored_email.lower().strip()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset token"
        )

    user = get_user_by_email(db, email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found")

    user.hashed_password = get_password_hash(payload.new_password)
    db.commit()

    token, expires_in = _build_token_response(user.email)
    return TokenResponse(access_token=token, expires_in=expires_in)
