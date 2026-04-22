from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user, require_roles
from app.db.session import get_db
from app.models import Activity, User, UserRole
from app.schemas.activity import ActivityCreate, ActivityRead, ActivityRegistrationRead
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
    list_activities,
)

router = APIRouter()


def _to_activity_read(db: Session, activity: Activity) -> ActivityRead:
    return ActivityRead(
        id=activity.id,
        title=activity.title,
        description=activity.description,
        place_id=activity.place_id,
        organizer_id=activity.organizer_id,
        date_time=activity.date_time,
        max_participants=activity.max_participants,
        participants_count=get_activity_participants_count(db, activity.id),
        created_at=activity.created_at,
        updated_at=activity.updated_at,
    )


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
    return _to_activity_read(db, activity)


@router.get("", response_model=list[ActivityRead])
def get_activities(db: Annotated[Session, Depends(get_db)]) -> list[ActivityRead]:
    activities = list_activities(db)
    return [_to_activity_read(db, activity) for activity in activities]


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
    return Response(status_code=status.HTTP_204_NO_CONTENT)
