from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import TimestampedBase


class Activity(TimestampedBase):
    __tablename__ = "activities"

    title: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
