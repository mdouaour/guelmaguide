from __future__ import annotations

from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import JSON, CheckConstraint, Float, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import TimestampedBase

if TYPE_CHECKING:
    from app.models.activity import Activity


class PlaceCategory(str, Enum):
    FOREST = "forest"
    SPORT = "sport"
    RELAXATION = "relaxation"
    CULTURE = "culture"


class Place(TimestampedBase):
    __tablename__ = "places"
    __table_args__ = (
        CheckConstraint(
            "category IN ('forest', 'sport', 'relaxation', 'culture')",
            name="ck_places_category",
        ),
    )

    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    category: Mapped[PlaceCategory] = mapped_column(String(32), index=True, nullable=False)
    theme: Mapped[str] = mapped_column(String(100), nullable=False)
    images: Mapped[list[str]] = mapped_column(JSON, default=lambda: [], nullable=False)
    activities: Mapped[list["Activity"]] = relationship(back_populates="place")
