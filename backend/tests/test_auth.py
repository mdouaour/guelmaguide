def test_register_and_me(client):
    register_response = client.post(
        "/api/v1/auth/register",
        json={"email": "visitor@example.com", "password": "StrongPass1!"},
    )
    assert register_response.status_code == 201

    token = register_response.json()["access_token"]
    me_response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert me_response.status_code == 200
    assert me_response.json()["email"] == "visitor@example.com"


def test_login_invalid_credentials(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "login@example.com", "password": "StrongPass1!"},
    )

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "login@example.com", "password": "WrongPass1!"},
    )
    assert response.status_code == 401
