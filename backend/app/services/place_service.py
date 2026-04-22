from math import asin, cos, radians, sin, sqrt

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.place import Place, PlaceCategory
from app.schemas.place import PlaceCreate

EARTH_RADIUS_KM = 6371.0


def list_places(db: Session) -> list[Place]:
    return list(db.scalars(select(Place).order_by(Place.created_at.desc())))


def get_place_by_id(db: Session, place_id: int) -> Place | None:
    return db.get(Place, place_id)


def list_places_by_category(db: Session, category: PlaceCategory) -> list[Place]:
    statement = select(Place).where(Place.category == category).order_by(Place.created_at.desc())
    return list(db.scalars(statement))


def create_place(db: Session, payload: PlaceCreate) -> Place:
    place = Place(**payload.model_dump())
    db.add(place)
    db.commit()
    db.refresh(place)
    return place


def calculate_distance_km(
    latitude: float, longitude: float, target_latitude: float, target_longitude: float
) -> float:
    lat1 = radians(latitude)
    lon1 = radians(longitude)
    lat2 = radians(target_latitude)
    lon2 = radians(target_longitude)

    dlat = lat2 - lat1
    dlon = lon2 - lon1
    haversine = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    return 2 * EARTH_RADIUS_KM * asin(sqrt(haversine))


def list_nearby_places(db: Session, latitude: float, longitude: float, radius_km: float) -> list[Place]:
    all_places = list_places(db)
    filtered_places: list[tuple[float, Place]] = []

    for place in all_places:
        distance = calculate_distance_km(latitude, longitude, place.latitude, place.longitude)
        if distance <= radius_km:
            filtered_places.append((distance, place))

    filtered_places.sort(key=lambda item: item[0])
    return [place for _, place in filtered_places]
