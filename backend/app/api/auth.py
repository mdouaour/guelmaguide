from datetime import timedelta
import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.rate_limit import rate_limit
from app.core.security import create_access_token, get_current_user
from app.db.session import get_db
from app.models import User, UserRole
from app.schemas.auth import LoginRequest, RegisterRequest, RegisterResponse, TokenResponse
from app.schemas.user import UserRead
from app.services.auth_service import authenticate_user, get_user_by_email, register_user

router = APIRouter()
logger = logging.getLogger("app.auth")


def _build_token_response(email: str) -> tuple[str, int]:
    expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(subject=email, expires_delta=expires_delta)
    return token, int(expires_delta.total_seconds())


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(
    payload: RegisterRequest,
    db: Annotated[Session, Depends(get_db)],
    _limit: Annotated[
        None,
        Depends(
            rate_limit(
                limit=settings.AUTH_RATE_LIMIT_REQUESTS,
                window_seconds=settings.AUTH_RATE_LIMIT_WINDOW_SECONDS,
                scope="auth_register",
            )
        ),
    ],
) -> RegisterResponse:
    existing_user = get_user_by_email(db, payload.email)
    if existing_user is not None:
        logger.warning("register_duplicate_email", extra={"email": payload.email})
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    try:
        user = register_user(db, payload.email, payload.password, UserRole.VISITOR)
    except ValueError as exc:
        logger.warning("register_failed", extra={"email": payload.email, "reason": str(exc)})
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)
        ) from exc
    token, expires_in = _build_token_response(user.email)
    logger.info("register_success", extra={"email": user.email, "role": user.role})

    return RegisterResponse(
        user=UserRead.model_validate(user),
        access_token=token,
        expires_in=expires_in,
    )


@router.post("/login", response_model=TokenResponse)
def login(
    payload: LoginRequest,
    db: Annotated[Session, Depends(get_db)],
    _limit: Annotated[
        None,
        Depends(
            rate_limit(
                limit=settings.AUTH_RATE_LIMIT_REQUESTS,
                window_seconds=settings.AUTH_RATE_LIMIT_WINDOW_SECONDS,
                scope="auth_login",
            )
        ),
    ],
) -> TokenResponse:
    user = authenticate_user(db, payload.email, payload.password)
    if user is None:
        logger.warning("login_failed", extra={"email": payload.email})
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token, expires_in = _build_token_response(user.email)
    logger.info("login_success", extra={"email": user.email})
    return TokenResponse(access_token=token, expires_in=expires_in)


@router.get("/me", response_model=UserRead)
def me(current_user: Annotated[User, Depends(get_current_user)]) -> UserRead:
    return UserRead.model_validate(current_user)
