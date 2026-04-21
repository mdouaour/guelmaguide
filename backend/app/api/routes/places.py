from fastapi import APIRouter

router = APIRouter()


@router.get("")
def places_placeholder() -> dict[str, str]:
    return {"message": "places endpoint placeholder"}
