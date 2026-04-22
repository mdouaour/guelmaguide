from fastapi.testclient import TestClient


def test_register_login_and_me_flow(client: TestClient) -> None:
    register_response = client.post(
        "/api/v1/auth/register",
        json={"email": "user@example.com", "password": "Password1!"},
    )
    assert register_response.status_code == 201
    token = register_response.json()["access_token"]

    me_response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_response.status_code == 200
    assert me_response.json()["email"] == "user@example.com"

    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": "user@example.com", "password": "Password1!"},
    )
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()


def test_register_duplicate_email_returns_400(client: TestClient) -> None:
    payload = {"email": "duplicate@example.com", "password": "Password1!"}
    assert client.post("/api/v1/auth/register", json=payload).status_code == 201
    duplicate = client.post("/api/v1/auth/register", json=payload)
    assert duplicate.status_code == 400


def test_login_with_wrong_password_returns_401(client: TestClient) -> None:
    client.post(
        "/api/v1/auth/register",
        json={"email": "wrong-pass@example.com", "password": "Password1!"},
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "wrong-pass@example.com", "password": "WrongPassword1!"},
    )
    assert response.status_code == 401
