import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.session import Base, get_db
from app.main import app
from app.models.project import Project  # noqa: F401  (makes sure the table is created)
from app.models.user import User  # noqa: F401

GOOD_IDEA = {
    "title": "Smart Campus Lost and Found",
    "description": "A web app where students report lost items and get matches using photos.",
}


@pytest.fixture()
def client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSession = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)


def auth_headers(client, email):
    response = client.post(
        "/api/auth/register",
        json={"name": "Test Student", "email": email, "password": "password123"},
    )
    assert response.status_code == 201
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


def test_create_project_valid(client):
    headers = auth_headers(client, "a@example.com")
    response = client.post("/api/projects", json=GOOD_IDEA, headers=headers)
    assert response.status_code == 201
    body = response.json()
    assert body["title"] == GOOD_IDEA["title"]
    assert body["status"] == "submitted"


def test_description_too_short(client):
    headers = auth_headers(client, "a@example.com")
    bad = {"title": "Good title", "description": "too short"}
    response = client.post("/api/projects", json=bad, headers=headers)
    assert response.status_code == 422


def test_description_whitespace_only(client):
    headers = auth_headers(client, "a@example.com")
    bad = {"title": "Good title", "description": " " * 30}
    response = client.post("/api/projects", json=bad, headers=headers)
    assert response.status_code == 422


def test_no_token(client):
    assert client.post("/api/projects", json=GOOD_IDEA).status_code == 401
    assert client.get("/api/projects").status_code == 401


def test_list_only_own_projects(client):
    headers_a = auth_headers(client, "a@example.com")
    headers_b = auth_headers(client, "b@example.com")
    client.post("/api/projects", json=GOOD_IDEA, headers=headers_a)

    list_a = client.get("/api/projects", headers=headers_a).json()
    list_b = client.get("/api/projects", headers=headers_b).json()

    assert len(list_a) == 1
    assert list_b == []