from fastapi import APIRouter

router = APIRouter()


@router.get("")
def activities_placeholder() -> dict[str, str]:
    return {"message": "activities endpoint placeholder"}
