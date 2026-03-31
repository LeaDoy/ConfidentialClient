"""WO-87: POS API key / HMAC validation (stub — enforce in middleware before GA)."""

from typing import Optional

from fastapi import APIRouter, Header

router = APIRouter(prefix="/api/v1/pos", tags=["pos"])


@router.get("/ping")
def ping(x_api_key: Optional[str] = Header(default=None, alias="X-API-Key")):
    return {"ok": True, "api_key_present": bool(x_api_key)}
