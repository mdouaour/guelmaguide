from unittest.mock import MagicMock, patch

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


# ---------------------------------------------------------------------------
# Password-reset tests
# ---------------------------------------------------------------------------

def test_request_password_reset_always_returns_200(client: TestClient) -> None:
    """The endpoint must return 200 even for unknown emails (no user enumeration)."""
    with (
        patch("app.api.auth.set_str"),
        patch("app.api.auth.send_password_reset_email"),
    ):
        response = client.post(
            "/api/v1/auth/request-password-reset",
            json={"email": "nonexistent@example.com"},
        )
    assert response.status_code == 200
    body = response.json()
    assert "message" in body
    # Token must NOT be present in the response.
    assert "token" not in body
    assert "reset_token" not in body


def test_request_password_reset_stores_token_and_sends_email(client: TestClient) -> None:
    """For a known user the token is stored in Redis and an email is dispatched."""
    client.post(
        "/api/v1/auth/register",
        json={"email": "reset-user@example.com", "password": "Password1!"},
    )

    captured: dict = {}

    def fake_set_str(key: str, value: str, ttl: int) -> None:
        captured["key"] = key
        captured["value"] = value
        captured["ttl"] = ttl

    def fake_send_email(to_email: str, reset_token: str) -> None:
        captured["email_to"] = to_email
        captured["reset_token"] = reset_token

    with (
        patch("app.api.auth.set_str", side_effect=fake_set_str),
        patch("app.api.auth.send_password_reset_email", side_effect=fake_send_email),
    ):
        response = client.post(
            "/api/v1/auth/request-password-reset",
            json={"email": "reset-user@example.com"},
        )

    assert response.status_code == 200
    assert captured.get("email_to") == "reset-user@example.com"
    assert captured.get("ttl") == 30 * 60
    # The key must be prefixed and the token must not appear in the HTTP response.
    assert captured.get("key", "").startswith("pwd_reset:")
    assert "token" not in response.json()


def test_reset_password_with_valid_token(client: TestClient) -> None:
    """Full happy path: request → consume token → password updated → new JWT returned."""
    client.post(
        "/api/v1/auth/register",
        json={"email": "full-reset@example.com", "password": "OldPassword1!"},
    )

    stored: dict = {}

    def fake_set_str(key: str, value: str, ttl: int) -> None:
        stored["key"] = key
        stored["value"] = value
        stored["token"] = key.removeprefix("pwd_reset:")

    with (
        patch("app.api.auth.set_str", side_effect=fake_set_str),
        patch("app.api.auth.send_password_reset_email"),
    ):
        client.post(
            "/api/v1/auth/request-password-reset",
            json={"email": "full-reset@example.com"},
        )

    reset_token = stored["token"]
    stored_email = stored["value"]

    # Simulate Redis returning the stored email for the token, then being deleted.
    with (
        patch("app.api.auth.get_str", return_value=stored_email),
        patch("app.api.auth.delete_key") as mock_delete,
    ):
        response = client.post(
            "/api/v1/auth/reset-password",
            json={"token": reset_token, "new_password": "NewPassword1!"},
        )

    assert response.status_code == 200
    assert "access_token" in response.json()
    # Token must have been deleted from Redis immediately.
    mock_delete.assert_called_once()

    # Verify the new password works.
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "full-reset@example.com", "password": "NewPassword1!"},
    )
    assert login.status_code == 200


def test_reset_password_with_expired_or_used_token(client: TestClient) -> None:
    """When Redis returns None (expired / already used) the reset must be rejected."""
    with patch("app.api.auth.get_str", return_value=None):
        response = client.post(
            "/api/v1/auth/reset-password",
            json={"token": "some.fake.token", "new_password": "NewPassword1!"},
        )
    assert response.status_code == 400


def test_reset_password_token_deleted_on_use(client: TestClient) -> None:
    """The Redis key must be deleted the moment the token is consumed."""
    client.post(
        "/api/v1/auth/register",
        json={"email": "once-reset@example.com", "password": "Password1!"},
    )

    stored: dict = {}

    def fake_set_str(key: str, value: str, ttl: int) -> None:
        stored["key"] = key
        stored["value"] = value
        stored["token"] = key.removeprefix("pwd_reset:")

    with (
        patch("app.api.auth.set_str", side_effect=fake_set_str),
        patch("app.api.auth.send_password_reset_email"),
    ):
        client.post(
            "/api/v1/auth/request-password-reset",
            json={"email": "once-reset@example.com"},
        )

    reset_token = stored["token"]

    delete_calls: list = []

    with (
        patch("app.api.auth.get_str", return_value=stored["value"]),
        patch("app.api.auth.delete_key", side_effect=lambda k: delete_calls.append(k)),
    ):
        r1 = client.post(
            "/api/v1/auth/reset-password",
            json={"token": reset_token, "new_password": "Password2!"},
        )
    assert r1.status_code == 200
    assert len(delete_calls) == 1
    assert delete_calls[0] == stored["key"]
