from pydantic import BaseModel, EmailStr, Field, field_validator

from app.schemas.user import UserRead


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, value: str) -> str:
        if not any(char.islower() for char in value):
            raise ValueError("Password must include at least one lowercase letter")
        if not any(char.isupper() for char in value):
            raise ValueError("Password must include at least one uppercase letter")
        if not any(char.isdigit() for char in value):
            raise ValueError("Password must include at least one digit")
        if value.isalnum():
            raise ValueError("Password must include at least one special character")
        return value


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)

    @field_validator("password")
    @classmethod
    def validate_password_not_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Password cannot be blank")
        return value


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class RegisterResponse(BaseModel):
    user: UserRead
    access_token: str
    token_type: str = "bearer"
    expires_in: int
