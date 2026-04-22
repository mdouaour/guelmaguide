from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_user, require_roles
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.activity import ActivityRead, to_activity_read
from app.services.activity_service import (
    get_activity_participants_counts,
    list_user_joined_activities,
)

router = APIRouter()


@router.get("")
def users_placeholder(
    current_user: Annotated[User, Depends(require_roles(UserRole.ADMIN))]
) -> dict[str, str]:
    return {"message": f"users endpoint placeholder, admin: {current_user.email}"}


@router.get("/me/activities", response_model=list[ActivityRead])
def my_activities(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> list[ActivityRead]:
    activities = list_user_joined_activities(db, current_user.id)
    participant_counts = get_activity_participants_counts(db, [activity.id for activity in activities])
    return [
        to_activity_read(activity, participant_counts.get(activity.id, 0))
        for activity in activities
    ]
