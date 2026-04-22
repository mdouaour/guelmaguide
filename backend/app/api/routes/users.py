from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_user, require_roles
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.activity import ActivityRead
from app.services.activity_service import get_activity_participants_count, list_user_joined_activities

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
    return [
        ActivityRead(
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
        for activity in activities
    ]
