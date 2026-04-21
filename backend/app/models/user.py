from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import TimestampedBase


class User(TimestampedBase):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
