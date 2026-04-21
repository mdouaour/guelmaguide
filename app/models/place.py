from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import TimestampedBase


class Place(TimestampedBase):
    __tablename__ = "places"

    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
