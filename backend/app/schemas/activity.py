from datetime import datetime
from typing import TYPE_CHECKING

from pydantic import BaseModel, Field

if TYPE_CHECKING:
    from app.models.activity import Activity


class ActivityBase(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    description: str = Field(min_length=10, max_length=4000)
    place_id: int
    date_time: datetime
    max_participants: int = Field(gt=0)


class ActivityCreate(ActivityBase):
    pass


class ActivityRead(ActivityBase):
    id: int
    organizer_id: int
    participants_count: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ActivityRegistrationRead(BaseModel):
    user_id: int
    activity_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class PaginatedActivitiesResponse(BaseModel):
    total: int = Field(ge=0)
    page: int = Field(ge=1)
    limit: int = Field(ge=1, le=100)
    results: list[ActivityRead]


def to_activity_read(activity: "Activity", participants_count: int) -> ActivityRead:
    return ActivityRead(
        id=activity.id,
        title=activity.title,
        description=activity.description,
        place_id=activity.place_id,
        organizer_id=activity.organizer_id,
        date_time=activity.date_time,
        max_participants=activity.max_participants,
        participants_count=participants_count,
        created_at=activity.created_at,
        updated_at=activity.updated_at,
    )
