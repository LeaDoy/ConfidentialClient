"""WO-11 stub: replace with token validation against Cognito / corporate IdP."""

from __future__ import annotations


def lambda_handler(event, context):
    # HTTP API v2 Lambda authorizer (simple response)
    return {"isAuthorized": True, "context": {"authorizer": "stub"}}
