from datetime import datetime

from pydantic import BaseModel


class UserRead(BaseModel):
    id: int
    email: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
