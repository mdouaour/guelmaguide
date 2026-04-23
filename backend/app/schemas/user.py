from datetime import datetime

from pydantic import BaseModel

from app.models.user import UserRole


class UserRead(BaseModel):
    id: int
    email: str
    role: UserRole
    organizer_verified: bool
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}
