from enum import Enum

from sqlalchemy import JSON, Float, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import TimestampedBase


class PlaceCategory(str, Enum):
    FOREST = "forest"
    SPORT = "sport"
    RELAXATION = "relaxation"
    CULTURE = "culture"


class Place(TimestampedBase):
    __tablename__ = "places"

    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    category: Mapped[PlaceCategory] = mapped_column(String(32), index=True, nullable=False)
    theme: Mapped[str] = mapped_column(String(100), nullable=False)
    images: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
