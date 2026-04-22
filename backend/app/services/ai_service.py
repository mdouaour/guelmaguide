from collections import Counter
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Activity, ActivityRegistration, Place
from app.schemas.ai import (
    RecommendedActivity,
    RecommendedPlace,
    RecommendationsResponse,
    TimeOfDay,
)
from app.services.activity_service import get_activity_participants_counts
from app.services.place_service import calculate_distance_km, list_places

MAX_PLACE_RESULTS = 6
MAX_ACTIVITY_RESULTS = 6

CATEGORY_ALIASES = {
    "forest": "nature",
    "nature": "nature",
    "sport": "sports",
    "sports": "sports",
    "relaxation": "thermal_baths",
    "thermal_baths": "thermal_baths",
    "culture": "culture",
}

TIME_CATEGORY_PREFERENCES: dict[TimeOfDay, set[str]] = {
    TimeOfDay.MORNING: {"nature", "sports"},
    TimeOfDay.AFTERNOON: {"culture", "sports", "nature"},
    TimeOfDay.EVENING: {"culture", "thermal_baths"},
}


def _normalize_category(category: str | None) -> str | None:
    if category is None:
        return None
    return CATEGORY_ALIASES.get(category.strip().lower())


def _activity_time_of_day(value: datetime) -> TimeOfDay:
    local_hour = value.astimezone(UTC).hour
    if local_hour < 12:
        return TimeOfDay.MORNING
    if local_hour < 18:
        return TimeOfDay.AFTERNOON
    return TimeOfDay.EVENING


def _user_history_profile(db: Session, user_id: int) -> tuple[set[int], Counter[str]]:
    joined_ids_statement = select(ActivityRegistration.activity_id).where(
        ActivityRegistration.user_id == user_id
    )
    joined_ids = {int(activity_id) for activity_id in db.scalars(joined_ids_statement)}

    category_statement = (
        select(Place.category)
        .select_from(ActivityRegistration)
        .join(Activity, Activity.id == ActivityRegistration.activity_id)
        .join(Place, Place.id == Activity.place_id)
        .where(ActivityRegistration.user_id == user_id)
    )
    category_counter = Counter(
        _normalize_category(str(category))
        for category in db.scalars(category_statement)
        if _normalize_category(str(category)) is not None
    )
    return joined_ids, category_counter


def _diversify_places(places: list[RecommendedPlace]) -> list[RecommendedPlace]:
    if len(places) < 3:
        return places
    categories = {str(place.category) for place in places[:3]}
    if len(categories) > 1:
        return places
    for index, candidate in enumerate(places[3:], start=3):
        if str(candidate.category) not in categories:
            diversified = places[:2] + [candidate] + places[3:index] + places[index + 1 :]
            return diversified
    return places


def get_recommendations(
    db: Session,
    *,
    latitude: float,
    longitude: float,
    category: str | None = None,
    time_of_day: TimeOfDay | None = None,
    current_user_id: int | None = None,
) -> RecommendationsResponse:
    now = datetime.now(UTC)
    normalized_category = _normalize_category(category)
    joined_activity_ids: set[int] = set()
    history_categories: Counter[str] = Counter()

    if current_user_id is not None:
        joined_activity_ids, history_categories = _user_history_profile(db, current_user_id)

    recommended_places: list[RecommendedPlace] = []
    for place in list_places(db):
        normalized_place_category = _normalize_category(str(place.category))
        distance_km = calculate_distance_km(latitude, longitude, place.latitude, place.longitude)

        score = max(0.0, 60.0 - (distance_km * 2.0))
        if normalized_category and normalized_place_category == normalized_category:
            score += 25.0
        if time_of_day and normalized_place_category in TIME_CATEGORY_PREFERENCES[time_of_day]:
            score += 8.0
        if normalized_place_category in history_categories:
            score += min(12.0, float(history_categories[normalized_place_category] * 3))

        recommended_places.append(
            RecommendedPlace(
                id=place.id,
                name=place.name,
                category=place.category,
                theme=place.theme,
                latitude=place.latitude,
                longitude=place.longitude,
                distance_km=round(distance_km, 2),
                score=round(score, 2),
            )
        )

    recommended_places.sort(key=lambda item: (-item.score, item.distance_km, item.id))
    recommended_places = _diversify_places(recommended_places[:MAX_PLACE_RESULTS])

    rows = db.execute(
        select(Activity, Place).join(Place, Place.id == Activity.place_id).where(Activity.date_time >= now)
    ).all()
    participant_counts = get_activity_participants_counts(db, [activity.id for activity, _ in rows])
    recommended_activities: list[RecommendedActivity] = []

    for activity, place in rows:
        participants_count = participant_counts.get(activity.id, 0)
        if participants_count >= activity.max_participants:
            continue

        normalized_place_category = _normalize_category(str(place.category))
        distance_km = calculate_distance_km(latitude, longitude, place.latitude, place.longitude)
        starts_in_hours = max(0.0, (activity.date_time - now).total_seconds() / 3600)

        score = max(0.0, 45.0 - (distance_km * 1.5))
        score += max(0.0, 20.0 - min(20.0, starts_in_hours / 2.0))

        if normalized_category and normalized_place_category == normalized_category:
            score += 25.0
        if time_of_day and _activity_time_of_day(activity.date_time) == time_of_day:
            score += 12.0
        if normalized_place_category in history_categories:
            score += min(12.0, float(history_categories[normalized_place_category] * 3))

        is_joined = activity.id in joined_activity_ids
        if is_joined:
            score -= 20.0
        elif current_user_id is not None:
            score += 8.0

        recommended_activities.append(
            RecommendedActivity(
                id=activity.id,
                title=activity.title,
                description=activity.description,
                place_id=place.id,
                place_name=place.name,
                place_category=place.category,
                date_time=activity.date_time,
                max_participants=activity.max_participants,
                participants_count=participants_count,
                available_slots=activity.max_participants - participants_count,
                is_joined=is_joined,
                distance_km=round(distance_km, 2),
                score=round(score, 2),
            )
        )

    recommended_activities.sort(key=lambda item: (-item.score, item.date_time, item.id))

    return RecommendationsResponse(
        recommended_places=recommended_places,
        recommended_activities=recommended_activities[:MAX_ACTIVITY_RESULTS],
    )
