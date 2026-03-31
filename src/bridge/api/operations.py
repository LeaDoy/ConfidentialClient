"""WO-9.x: operations endpoints (stubs)."""

from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/operations", tags=["operations"])


@router.get("/transactions")
def list_transactions():
    return {"items": []}


@router.get("/exceptions")
def list_exceptions():
    return {"items": []}
