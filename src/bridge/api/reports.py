"""WO-41/42/43/84: reporting endpoints (stubs)."""

from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/reports", tags=["reports"])


@router.get("/ach/summary")
def ach_location_summary():
    return {"locations": [], "detail": "stub"}
