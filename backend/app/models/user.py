from enum import Enum

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import TimestampedBase


class UserRole(str, Enum):
    VISITOR = "visitor"
    ORGANIZER = "organizer"
    ADMIN = "admin"


class User(TimestampedBase):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        String(20), default=UserRole.VISITOR, nullable=False
    )
