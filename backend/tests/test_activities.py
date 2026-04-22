from datetime import UTC, datetime, timedelta

from app.core.security import create_access_token
from app.models.place import Place
from app.models.user import UserRole
from app.services.auth_service import register_user


def test_create_and_join_activity(client, db):
    organizer = register_user(db, "organizer@example.com", "StrongPass1!", role=UserRole.ORGANIZER)
    visitor = register_user(db, "visitor2@example.com", "StrongPass1!", role=UserRole.VISITOR)

    place = Place(
        name="Parc de Loisir",
        description="Family park in Guelma.",
        latitude=36.466,
        longitude=7.430,
        category="nature",
        theme="relax",
        images=[],
    )
    db.add(place)
    db.commit()
    db.refresh(place)

    organizer_token = create_access_token(subject=organizer.email)
    activity_payload = {
        "title": "Morning Walk",
        "description": "Community walk event.",
        "place_id": place.id,
        "date_time": (datetime.now(UTC) + timedelta(days=1)).isoformat(),
        "max_participants": 10,
    }
    create_response = client.post(
        "/api/v1/activities",
        json=activity_payload,
        headers={"Authorization": f"Bearer {organizer_token}"},
    )
    assert create_response.status_code == 201
    activity_id = create_response.json()["id"]

    visitor_token = create_access_token(subject=visitor.email)
    join_response = client.post(
        f"/api/v1/activities/{activity_id}/join",
        headers={"Authorization": f"Bearer {visitor_token}"},
    )

    assert join_response.status_code == 200
    assert join_response.json()["user_id"] == visitor.id
