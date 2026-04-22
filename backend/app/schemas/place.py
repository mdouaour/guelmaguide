from datetime import datetime

from pydantic import BaseModel, Field

from app.models.place import PlaceCategory


class PlaceBase(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    description: str = Field(min_length=10, max_length=4000)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    category: PlaceCategory
    theme: str = Field(min_length=2, max_length=100)
    images: list[str] = Field(default_factory=list)


class PlaceCreate(PlaceBase):
    pass


class PlaceRead(PlaceBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PaginatedPlacesResponse(BaseModel):
    total: int = Field(ge=0)
    page: int = Field(ge=1)
    limit: int = Field(ge=1, le=100)
    results: list[PlaceRead]
