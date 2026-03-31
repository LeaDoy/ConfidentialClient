from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="BRIDGE_", env_file=".env", extra="ignore")

    app_name: str = "bridge"
    environment: str = "dev"
    redis_url: Optional[str] = None
    oracle_dsn: Optional[str] = None
    aws_region: Optional[str] = None


@lru_cache
def get_settings() -> Settings:
    return Settings()
