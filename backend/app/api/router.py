from fastapi import APIRouter

from app.api.activities import router as activities_router
from app.api.admin import router as admin_router
from app.api.ai import router as ai_router
from app.api.auth import router as auth_router
from app.api.places import router as places_router
from app.api.routes.users import router as users_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(places_router, prefix="/places", tags=["places"])
api_router.include_router(activities_router, prefix="/activities", tags=["activities"])
api_router.include_router(ai_router, prefix="/ai", tags=["ai"])
api_router.include_router(admin_router, prefix="/admin", tags=["admin"])
