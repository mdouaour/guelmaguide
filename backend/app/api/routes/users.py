from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.security import require_roles
from app.models.user import User, UserRole

router = APIRouter()


@router.get("")
def users_placeholder(
    current_user: Annotated[User, Depends(require_roles(UserRole.ADMIN))]
) -> dict[str, str]:
    return {"message": f"users endpoint placeholder, admin: {current_user.email}"}
