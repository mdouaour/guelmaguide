from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.security import require_roles
from app.db.session import get_db
from app.models.place import PlaceCategory
from app.models.user import User, UserRole
from app.schemas.place import PlaceCreate, PlaceRead
from app.services.place_service import (
    create_place,
    get_place_by_id,
    list_nearby_places,
    list_places,
    list_places_by_category,
)

router = APIRouter()


@router.get("", response_model=list[PlaceRead])
def get_places(db: Annotated[Session, Depends(get_db)]) -> list[PlaceRead]:
    places = list_places(db)
    return [PlaceRead.model_validate(place) for place in places]


@router.get("/category/{category}", response_model=list[PlaceRead])
def get_places_by_category(
    category: PlaceCategory, db: Annotated[Session, Depends(get_db)]
) -> list[PlaceRead]:
    places = list_places_by_category(db, category)
    return [PlaceRead.model_validate(place) for place in places]


@router.get("/nearby", response_model=list[PlaceRead])
def get_nearby_places(
    latitude: Annotated[float, Query(ge=-90, le=90)],
    longitude: Annotated[float, Query(ge=-180, le=180)],
    radius: Annotated[float, Query(gt=0, le=1000)],
    db: Annotated[Session, Depends(get_db)],
) -> list[PlaceRead]:
    places = list_nearby_places(db, latitude=latitude, longitude=longitude, radius_km=radius)
    return [PlaceRead.model_validate(place) for place in places]


@router.get("/{place_id}", response_model=PlaceRead)
def get_place(place_id: int, db: Annotated[Session, Depends(get_db)]) -> PlaceRead:
    place = get_place_by_id(db, place_id)
    if place is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Place not found")
    return PlaceRead.model_validate(place)


@router.post("", response_model=PlaceRead, status_code=status.HTTP_201_CREATED)
def create_new_place(
    payload: PlaceCreate,
    db: Annotated[Session, Depends(get_db)],
    _current_user: Annotated[User, Depends(require_roles(UserRole.ADMIN, UserRole.ORGANIZER))],
) -> PlaceRead:
    place = create_place(db, payload)
    return PlaceRead.model_validate(place)
