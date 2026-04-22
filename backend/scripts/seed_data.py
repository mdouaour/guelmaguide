from datetime import UTC, datetime, timedelta

from sqlalchemy import select

from app.db.base_class import Base
from app.db.session import SessionLocal, engine
from app.models.activity import Activity
from app.models.place import Place
from app.models.user import UserRole
from app.services.auth_service import get_user_by_email, register_user


def seed_places(session) -> list[Place]:
    places_payload = [
        {
            "name": "Hammam Debagh",
            "description": "Natural thermal waterfalls and hot springs near Guelma.",
            "latitude": 36.4620,
            "longitude": 7.2780,
            "category": "thermal_baths",
            "theme": "wellness",
            "images": ["https://example.com/hammam-debagh.jpg"],
        },
        {
            "name": "Roman Theatre of Guelma",
            "description": "Historic Roman theatre at the heart of the city.",
            "latitude": 36.4628,
            "longitude": 7.4267,
            "category": "culture",
            "theme": "history",
            "images": ["https://example.com/roman-theatre.jpg"],
        },
        {
            "name": "Ain Larbi Springs",
            "description": "Fresh springs and green scenery ideal for outdoor trips.",
            "latitude": 36.5023,
            "longitude": 7.1095,
            "category": "nature",
            "theme": "nature",
            "images": ["https://example.com/ain-larbi.jpg"],
        },
    ]

    existing_places = list(session.scalars(select(Place)))
    if existing_places:
        return existing_places

    places = [Place(**payload) for payload in places_payload]
    session.add_all(places)
    session.commit()
    for place in places:
        session.refresh(place)
    return places


def seed_activities(session, organizer_id: int, places: list[Place]) -> None:
    if session.scalar(select(Activity.id).limit(1)) is not None:
        return

    now = datetime.now(UTC)
    activities_payload = [
        {
            "title": "Sunrise Walk",
            "description": "Early morning guided walk around Ain Larbi.",
            "place_id": places[2].id,
            "organizer_id": organizer_id,
            "date_time": now + timedelta(days=1, hours=8),
            "max_participants": 20,
        },
        {
            "title": "Roman Heritage Tour",
            "description": "Local guide explains Guelma Roman history.",
            "place_id": places[1].id,
            "organizer_id": organizer_id,
            "date_time": now + timedelta(days=2, hours=16),
            "max_participants": 15,
        },
    ]

    session.add_all(Activity(**payload) for payload in activities_payload)
    session.commit()


def main() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as session:
        organizer = get_user_by_email(session, "organizer@guelmaguide.local")
        if organizer is None:
            organizer = register_user(
                session,
                email="organizer@guelmaguide.local",
                password="OrganizerPass1!",
                role=UserRole.ORGANIZER,
            )

        visitor = get_user_by_email(session, "visitor@guelmaguide.local")
        if visitor is None:
            register_user(
                session,
                email="visitor@guelmaguide.local",
                password="VisitorPass1!",
                role=UserRole.VISITOR,
            )

        places = seed_places(session)
        seed_activities(session, organizer_id=organizer.id, places=places)

    print("Seed data inserted successfully.")


if __name__ == "__main__":
    main()
