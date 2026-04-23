from __future__ import annotations

from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, JSON, CheckConstraint, Float, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import TimestampedBase

if TYPE_CHECKING:
    from app.models.activity import Activity


class PlaceCategory(str, Enum):
    FOREST = "forest"
    SPORT = "sport"
    SPORTS = "sports"
    RELAXATION = "relaxation"
    CULTURE = "culture"
    NATURE = "nature"
    THERMAL_BATHS = "thermal_baths"


class Place(TimestampedBase):
    __tablename__ = "places"
    __table_args__ = (
        CheckConstraint(
            "category IN ('forest', 'sport', 'sports', 'relaxation', 'culture', 'nature', 'thermal_baths')",
            name="ck_places_category",
        ),
        Index("ix_places_latitude_longitude_category", "latitude", "longitude", "category"),
    )

    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    latitude: Mapped[float] = mapped_column(Float, index=True, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, index=True, nullable=False)
    category: Mapped[PlaceCategory] = mapped_column(String(32), index=True, nullable=False)
    theme: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    images: Mapped[list[str]] = mapped_column(JSON, default=lambda: [], nullable=False)
    featured: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="0")
    activities: Mapped[list["Activity"]] = relationship(back_populates="place")
