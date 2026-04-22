from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

def _create_engine(database_url: str):
    engine_kwargs: dict = {"pool_pre_ping": True}
    if database_url.startswith("sqlite"):
        engine_kwargs["connect_args"] = {"check_same_thread": False}
    return create_engine(database_url, **engine_kwargs)


def configure_engine(database_url: str | None = None) -> None:
    global engine, SessionLocal
    resolved_url = database_url or settings.DATABASE_URL
    engine = _create_engine(resolved_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


configure_engine()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
