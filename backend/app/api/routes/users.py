from fastapi import APIRouter

router = APIRouter()


@router.get("")
def users_placeholder() -> dict[str, str]:
    return {"message": "users endpoint placeholder"}
