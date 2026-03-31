"""WO-20/21/22/56: Change fund ingestion and delivery (stubs)."""

from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/change-fund", tags=["change-fund"])


@router.post("/events")
def receive_purchase_event(payload: dict):
    return {"accepted": True, "detail": "stub", "payload_keys": list(payload.keys())}


@router.get("/transactions/{transaction_id}")
def transaction_detail(transaction_id: str):
    return {"transaction_id": transaction_id, "detail": "stub"}
