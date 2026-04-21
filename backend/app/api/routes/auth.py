from fastapi import APIRouter

router = APIRouter()


@router.get("")
def auth_placeholder() -> dict[str, str]:
    return {"message": "auth endpoint placeholder"}
