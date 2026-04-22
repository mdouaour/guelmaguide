from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import Activity, ActivityRegistration, Place
from app.schemas.activity import ActivityCreate


class ActivityError(Exception):
    pass


class ActivityNotFoundError(ActivityError):
    pass


class InvalidPlaceError(ActivityError):
    pass


class DuplicateRegistrationError(ActivityError):
    pass


class ActivityFullError(ActivityError):
    pass


def list_activities(db: Session) -> list[Activity]:
    statement = select(Activity).order_by(Activity.date_time.asc())
    return list(db.scalars(statement))


def get_activity_by_id(db: Session, activity_id: int) -> Activity | None:
    return db.get(Activity, activity_id)


def get_activity_participants_count(db: Session, activity_id: int) -> int:
    return int(
        db.scalar(
            select(func.count(ActivityRegistration.user_id)).where(
                ActivityRegistration.activity_id == activity_id
            )
        )
        or 0
    )


def create_activity(db: Session, payload: ActivityCreate, organizer_id: int) -> Activity:
    place = db.get(Place, payload.place_id)
    if place is None:
        raise InvalidPlaceError("Invalid place_id")

    activity = Activity(**payload.model_dump(), organizer_id=organizer_id)
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity


def join_activity(db: Session, activity_id: int, user_id: int) -> ActivityRegistration:
    activity = get_activity_by_id(db, activity_id)
    if activity is None:
        raise ActivityNotFoundError("Activity not found")

    existing = db.get(ActivityRegistration, (user_id, activity_id))
    if existing is not None:
        raise DuplicateRegistrationError("User already joined this activity")

    participants_count = get_activity_participants_count(db, activity_id)
    if participants_count >= activity.max_participants:
        raise ActivityFullError("Activity is full")

    registration = ActivityRegistration(user_id=user_id, activity_id=activity_id)
    db.add(registration)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise DuplicateRegistrationError("User already joined this activity")
    db.refresh(registration)
    return registration


def leave_activity(db: Session, activity_id: int, user_id: int) -> bool:
    registration = db.get(ActivityRegistration, (user_id, activity_id))
    if registration is None:
        return False
    db.delete(registration)
    db.commit()
    return True


def list_user_joined_activities(db: Session, user_id: int) -> list[Activity]:
    statement = (
        select(Activity)
        .join(ActivityRegistration, ActivityRegistration.activity_id == Activity.id)
        .where(ActivityRegistration.user_id == user_id)
        .order_by(Activity.date_time.asc())
    )
    return list(db.scalars(statement))
