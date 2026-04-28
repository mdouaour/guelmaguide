from __future__ import annotations

from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, CheckConstraint, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import TimestampedBase

if TYPE_CHECKING:
    from app.models.activity import Activity, ActivityRegistration


class UserRole(str, Enum):
    VISITOR = "visitor"
    ORGANIZER = "organizer"
    ADMIN = "admin"


MAX_ROLE_LENGTH = 20


class User(TimestampedBase):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint("role IN ('visitor', 'organizer', 'admin')", name="ck_users_role"),
    )

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        String(MAX_ROLE_LENGTH), default=UserRole.VISITOR, nullable=False
    )
    organizer_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="0")
    email_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="0")
    organized_activities: Mapped[list["Activity"]] = relationship(
        back_populates="organizer",
        foreign_keys="Activity.organizer_id",
    )
    activity_registrations: Mapped[list["ActivityRegistration"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )
    joined_activities: Mapped[list["Activity"]] = relationship(
        secondary="activity_registrations",
        back_populates="participants",
        viewonly=True,
    )
