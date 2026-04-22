from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.core.cache import get_cached_json, invalidate_cache_prefix, set_cached_json
from app.core.config import settings
from app.core.security import get_current_user, require_roles
from app.db.session import get_db
from app.models import Activity, User, UserRole
from app.models.place import PlaceCategory
from app.schemas.activity import (
    ActivityCreate,
    ActivityRead,
    ActivityRegistrationRead,
    PaginatedActivitiesResponse,
    to_activity_read,
)
from app.services.activity_service import (
    ActivityFullError,
    ActivityNotFoundError,
    DuplicateRegistrationError,
    InvalidPlaceError,
    create_activity,
    get_activity_by_id,
    get_activity_participants_count,
    join_activity,
    leave_activity,
    list_activities_with_counts,
)

router = APIRouter()


def _to_activity_read(db: Session, activity: Activity) -> ActivityRead:
    return to_activity_read(activity, get_activity_participants_count(db, activity.id))


@router.post("", response_model=ActivityRead, status_code=status.HTTP_201_CREATED)
def create_new_activity(
    payload: ActivityCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(require_roles(UserRole.ORGANIZER))],
) -> ActivityRead:
    try:
        activity = create_activity(db, payload, organizer_id=current_user.id)
    except InvalidPlaceError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    invalidate_cache_prefix("activities:")
    return _to_activity_read(db, activity)


@router.get("", response_model=list[ActivityRead] | PaginatedActivitiesResponse)
def get_activities(
    db: Annotated[Session, Depends(get_db)],
    date_filter: Annotated[date | None, Query(alias="date")] = None,
    place: Annotated[int | None, Query(ge=1)] = None,
    availability: Annotated[bool, Query()] = False,
    category: Annotated[PlaceCategory | None, Query()] = None,
    page: Annotated[int | None, Query(ge=1)] = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> list[ActivityRead] | PaginatedActivitiesResponse:
    cache_key = (
        "activities:list:"
        f"date={date_filter}:place={place}:availability={availability}:"
        f"category={category.value if category else ''}:page={page}:limit={limit}"
    )
    cached = get_cached_json(cache_key)
    if cached is not None:
        if page is None:
            return [ActivityRead.model_validate(item) for item in cached]
        return PaginatedActivitiesResponse.model_validate(cached)

    rows, total = list_activities_with_counts(
        db,
        date_filter=date_filter,
        place_id=place,
        availability_only=availability,
        category=category,
        page=page,
        limit=limit,
    )
    results = [to_activity_read(activity, participants_count) for activity, participants_count in rows]
    if page is None:
        set_cached_json(
            cache_key,
            [item.model_dump(mode="json") for item in results],
            settings.REDIS_CACHE_TTL_SECONDS,
        )
        return results

    response_payload = PaginatedActivitiesResponse(
        total=total, page=page, limit=limit, results=results
    )
    set_cached_json(
        cache_key, response_payload.model_dump(mode="json"), settings.REDIS_CACHE_TTL_SECONDS
    )
    return response_payload


@router.get("/{activity_id}", response_model=ActivityRead)
def get_activity(activity_id: int, db: Annotated[Session, Depends(get_db)]) -> ActivityRead:
    activity = get_activity_by_id(db, activity_id)
    if activity is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    return _to_activity_read(db, activity)


@router.post("/{activity_id}/join", response_model=ActivityRegistrationRead)
def join_activity_endpoint(
    activity_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> ActivityRegistrationRead:
    try:
        registration = join_activity(db, activity_id=activity_id, user_id=current_user.id)
    except ActivityNotFoundError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except DuplicateRegistrationError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    except ActivityFullError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    invalidate_cache_prefix("activities:")
    return ActivityRegistrationRead.model_validate(registration)


@router.delete("/{activity_id}/leave", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
def leave_activity_endpoint(
    activity_id: int,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> Response:
    left = leave_activity(db, activity_id=activity_id, user_id=current_user.id)
    if not left:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Registration not found for this activity",
        )
    invalidate_cache_prefix("activities:")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
