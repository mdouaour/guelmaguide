from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.security import get_optional_current_user
from app.db.session import get_db
from app.models import User
from app.schemas.ai import RecommendationsResponse, TimeOfDay
from app.services.ai_service import get_recommendations

router = APIRouter()


@router.get("/recommendations", response_model=RecommendationsResponse)
def recommendations(
    latitude: Annotated[float, Query(ge=-90, le=90)],
    longitude: Annotated[float, Query(ge=-180, le=180)],
    category: Annotated[str | None, Query()] = None,
    time_of_day: Annotated[TimeOfDay | None, Query()] = None,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User | None, Depends(get_optional_current_user)],
) -> RecommendationsResponse:
    return get_recommendations(
        db,
        latitude=latitude,
        longitude=longitude,
        category=category,
        time_of_day=time_of_day,
        current_user_id=current_user.id if current_user else None,
    )
