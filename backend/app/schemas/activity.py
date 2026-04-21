from datetime import datetime

from pydantic import BaseModel


class ActivityRead(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
