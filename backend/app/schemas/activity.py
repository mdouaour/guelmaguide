from datetime import datetime

from pydantic import BaseModel, Field


class ActivityBase(BaseModel):
    title: str
    description: str
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
