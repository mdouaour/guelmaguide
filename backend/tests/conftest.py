import os
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

TEST_DB_FILE = Path(__file__).parent / "test.db"
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-with-minimum-32-chars")
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB_FILE}"

from app.db.base_class import Base
import app.db.session as db_session
from app.main import app


db_session.configure_engine(os.environ["DATABASE_URL"])


@pytest.fixture()
def client() -> TestClient:
    Base.metadata.drop_all(bind=db_session.engine)
    Base.metadata.create_all(bind=db_session.engine)
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture()
def db():
    session = db_session.SessionLocal()
    try:
        yield session
    finally:
        session.close()
