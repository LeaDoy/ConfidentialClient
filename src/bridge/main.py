import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from bridge.api import change_fund, health, operations, pos, reports
from bridge.config import get_settings
from bridge.middleware.correlation import CorrelationIdMiddleware

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    settings = get_settings()

    @asynccontextmanager
    async def lifespan(_app: FastAPI):
        logger.info("starting %s in %s", settings.app_name, settings.environment)
        yield

    app = FastAPI(title=settings.app_name, version="0.1.0", lifespan=lifespan)
    app.add_middleware(CorrelationIdMiddleware)
    app.include_router(health.router)
    app.include_router(change_fund.router)
    app.include_router(operations.router)
    app.include_router(pos.router)
    app.include_router(reports.router)

    return app


app = create_app()
