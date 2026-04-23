import logging
from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

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
        user = register_user(db, payload.email, payload.password, UserRole.VISITOR)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        ) from exc
    token, expires_in = _build_token_response(user.email)

    return RegisterResponse(
        user=UserRead.model_validate(user),
        access_token=token,
        expires_in=expires_in,
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


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordResetRequestResponse(BaseModel):
    message: str


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str


_PASSWORD_RESET_SCOPE = "password-reset"
_PASSWORD_RESET_EXPIRE_MINUTES = 30


@router.post("/request-password-reset", response_model=PasswordResetRequestResponse)
def request_password_reset(
    payload: PasswordResetRequest,
    db: Annotated[Session, Depends(get_db)],
) -> PasswordResetRequestResponse:
    user = get_user_by_email(db, payload.email)
    if user is not None:
        reset_token = create_access_token(
            subject=payload.email,
            expires_delta=timedelta(minutes=_PASSWORD_RESET_EXPIRE_MINUTES),
            extra_claims={"scope": _PASSWORD_RESET_SCOPE},
        )
        if settings.APP_ENV != "production":
            # Development only — replace with a real email delivery call in production.
            logger.debug("Password reset token for %s: %s", payload.email, reset_token)
    # Always return the same response to avoid user enumeration.
    return PasswordResetRequestResponse(
        message="If this email is registered, a reset link will be sent.",
    )


@router.post("/reset-password", response_model=TokenResponse)
def reset_password(
    payload: PasswordResetConfirm,
    db: Annotated[Session, Depends(get_db)],
) -> TokenResponse:
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

    user = get_user_by_email(db, email)
    if user is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found")

    user.hashed_password = get_password_hash(payload.new_password)
    db.commit()

    token, expires_in = _build_token_response(user.email)
    return TokenResponse(access_token=token, expires_in=expires_in)
