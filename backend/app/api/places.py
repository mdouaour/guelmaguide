from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.cache import get_cached_json, invalidate_cache_prefix, set_cached_json
from app.core.config import settings
from app.core.security import require_roles
from app.db.session import get_db
from app.models.place import PlaceCategory
from app.models.user import User, UserRole
from app.schemas.place import PaginatedPlacesResponse, PlaceCreate, PlaceRead
from app.services.place_service import (
    create_place,
    get_place_by_id,
    list_featured_places,
    list_nearby_places,
    list_places,
    list_places_by_category,
)

router = APIRouter()


@router.get("", response_model=PaginatedPlacesResponse)
def get_places(
    db: Annotated[Session, Depends(get_db)],
    category: Annotated[PlaceCategory | None, Query()] = None,
    distance: Annotated[float | None, Query(gt=0, le=1000)] = None,
    keyword: Annotated[str | None, Query(min_length=1, max_length=100)] = None,
    theme: Annotated[str | None, Query(min_length=1, max_length=100)] = None,
    latitude: Annotated[float | None, Query(ge=-90, le=90)] = None,
    longitude: Annotated[float | None, Query(ge=-180, le=180)] = None,
    page: Annotated[int, Query(ge=1)] = 1,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> PaginatedPlacesResponse:
    if distance is not None and (latitude is None or longitude is None):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="latitude and longitude are required when distance is provided",
        )
    normalized_keyword = keyword.strip() if keyword else None
    normalized_theme = theme.strip() if theme else None

    cache_key = (
        "places:list:"
        f"category={category.value if category else ''}:"
        f"distance={distance}:keyword={normalized_keyword or ''}:theme={normalized_theme or ''}:"
        f"lat={latitude}:lon={longitude}:page={page}:limit={limit}"
    )
    cached = get_cached_json(cache_key)
    if cached is not None:
        return PaginatedPlacesResponse.model_validate(cached)

    try:
        places, total = list_places(
            db,
            category=category,
            keyword=normalized_keyword,
            theme=normalized_theme,
            latitude=latitude,
            longitude=longitude,
            distance_km=distance,
            page=page,
            limit=limit,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc
    results = [PlaceRead.model_validate(place) for place in places]
    response_payload = PaginatedPlacesResponse(total=total, page=page, limit=limit, results=results)
    set_cached_json(cache_key, response_payload.model_dump(mode="json"), settings.REDIS_CACHE_TTL_SECONDS)
    return response_payload


@router.get("/category/{category}", response_model=list[PlaceRead])
def get_places_by_category(
    category: PlaceCategory, db: Annotated[Session, Depends(get_db)]
) -> list[PlaceRead]:
    cache_key = f"places:category:{category.value}"
    cached = get_cached_json(cache_key)
    if cached is not None:
        return [PlaceRead.model_validate(item) for item in cached]
    places = list_places_by_category(db, category)
    payload = [PlaceRead.model_validate(place) for place in places]
    set_cached_json(
        cache_key,
        [item.model_dump(mode="json") for item in payload],
        settings.REDIS_CACHE_TTL_SECONDS,
    )
    return payload


@router.get("/nearby", response_model=list[PlaceRead])
def get_nearby_places(
    latitude: Annotated[float, Query(ge=-90, le=90)],
    longitude: Annotated[float, Query(ge=-180, le=180)],
    radius: Annotated[float, Query(gt=0, le=1000)],
    db: Annotated[Session, Depends(get_db)],
) -> list[PlaceRead]:
    cache_key = f"places:nearby:lat={latitude}:lon={longitude}:r={radius}"
    cached = get_cached_json(cache_key)
    if cached is not None:
        return [PlaceRead.model_validate(item) for item in cached]
    places = list_nearby_places(db, latitude=latitude, longitude=longitude, radius_km=radius)
    payload = [PlaceRead.model_validate(place) for place in places]
    set_cached_json(
        cache_key,
        [item.model_dump(mode="json") for item in payload],
        settings.REDIS_CACHE_TTL_SECONDS,
    )
    return payload


@router.get("/featured", response_model=list[PlaceRead])
def get_featured_places(db: Annotated[Session, Depends(get_db)]) -> list[PlaceRead]:
    places = list_featured_places(db, limit=6)
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
    invalidate_cache_prefix("places:")
    return PlaceRead.model_validate(place)
