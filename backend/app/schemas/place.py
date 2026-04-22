from datetime import datetime

from pydantic import BaseModel, Field

from app.models.place import PlaceCategory


class PlaceBase(BaseModel):
    name: str
    description: str
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    category: PlaceCategory
    theme: str
    images: list[str] = Field(default_factory=list)


class PlaceCreate(PlaceBase):
    pass


class PlaceRead(PlaceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
