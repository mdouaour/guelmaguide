from app.core.security import create_access_token
from app.models.user import UserRole
from app.services.auth_service import register_user


def test_create_and_list_places(client, db):
    admin = register_user(db, "admin@example.com", "StrongPass1!", role=UserRole.ADMIN)
    token = create_access_token(subject=admin.email)

    payload = {
        "name": "Hammam Debagh",
        "description": "Famous thermal waterfalls near Guelma.",
        "latitude": 36.462,
        "longitude": 7.278,
        "category": "thermal_baths",
        "theme": "nature",
        "images": ["https://example.com/hammam-debagh.jpg"],
    }
    create_response = client.post(
        "/api/v1/places",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert create_response.status_code == 201

    list_response = client.get("/api/v1/places")
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1
