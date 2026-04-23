from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import require_roles
from app.db.session import get_db
from app.models.activity import Activity
from app.models.user import User, UserRole
from app.schemas.activity import ActivityRead, PaginatedActivitiesResponse, to_activity_read
from app.schemas.user import UserRead
from app.services.activity_service import (
    get_activity_by_id,
    get_activity_participants_count,
    list_activities_with_counts,
)

router = APIRouter()

admin_required = require_roles(UserRole.ADMIN)


def _to_activity_read_admin(db: Session, activity: Activity) -> ActivityRead:
    place_name = activity.place.name if activity.place else ""
    organizer_verified = activity.organizer.organizer_verified if activity.organizer else False
    return to_activity_read(
        activity,
        get_activity_participants_count(db, activity.id),
        place_name=place_name,
        organizer_verified=organizer_verified,
    )


@router.get("/activities", response_model=PaginatedActivitiesResponse)
def admin_list_activities(
    db: Annotated[Session, Depends(get_db)],
    _admin: Annotated[User, Depends(admin_required)],
    page: Annotated[int, Query(ge=1)] = 1,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> PaginatedActivitiesResponse:
    rows, total = list_activities_with_counts(
        db,
        include_non_public=True,
        page=page,
        limit=limit,
    )
    results = [
        to_activity_read(
            activity,
            count,
            place_name=activity.place.name if activity.place else "",
            organizer_verified=activity.organizer.organizer_verified if activity.organizer else False,
        )
        for activity, count in rows
    ]
    return PaginatedActivitiesResponse(total=total, page=page, limit=limit, results=results)


@router.patch("/activities/{activity_id}/approve", response_model=ActivityRead)
def admin_approve_activity(
    activity_id: int,
    db: Annotated[Session, Depends(get_db)],
    _admin: Annotated[User, Depends(admin_required)],
) -> ActivityRead:
    activity = get_activity_by_id(db, activity_id)
    if activity is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    activity.approval_status = "approved"
    db.commit()
    db.refresh(activity)
    return _to_activity_read_admin(db, activity)


@router.patch("/activities/{activity_id}/reject", response_model=ActivityRead)
def admin_reject_activity(
    activity_id: int,
    db: Annotated[Session, Depends(get_db)],
    _admin: Annotated[User, Depends(admin_required)],
) -> ActivityRead:
    activity = get_activity_by_id(db, activity_id)
    if activity is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    activity.approval_status = "rejected"
    db.commit()
    db.refresh(activity)
    return _to_activity_read_admin(db, activity)


@router.get("/users", response_model=list[UserRead])
def admin_list_users(
    db: Annotated[Session, Depends(get_db)],
    _admin: Annotated[User, Depends(admin_required)],
) -> list[UserRead]:
    users = list(db.scalars(select(User).order_by(User.created_at.asc())))
    return [UserRead.model_validate(user) for user in users]


@router.patch("/users/{user_id}/verify-organizer", response_model=UserRead)
def admin_verify_organizer(
    user_id: int,
    db: Annotated[Session, Depends(get_db)],
    _admin: Annotated[User, Depends(admin_required)],
) -> UserRead:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.organizer_verified = True
    db.commit()
    db.refresh(user)
    return UserRead.model_validate(user)


@router.patch("/users/{user_id}/promote", response_model=UserRead)
def admin_promote_user(
    user_id: int,
    db: Annotated[Session, Depends(get_db)],
    _admin: Annotated[User, Depends(admin_required)],
) -> UserRead:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.role = UserRole.ORGANIZER
    db.commit()
    db.refresh(user)
    return UserRead.model_validate(user)


@router.patch("/users/{user_id}/demote", response_model=UserRead)
def admin_demote_user(
    user_id: int,
    db: Annotated[Session, Depends(get_db)],
    _admin: Annotated[User, Depends(admin_required)],
) -> UserRead:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.role = UserRole.VISITOR
    db.commit()
    db.refresh(user)
    return UserRead.model_validate(user)
