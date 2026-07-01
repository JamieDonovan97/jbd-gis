"""Runtime configuration, read from the environment."""

from __future__ import annotations

import os
from dataclasses import dataclass

_R2_KEYS = ("R2_ENDPOINT", "R2_BUCKET", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY")


@dataclass(frozen=True)
class R2Config:
    """Credentials for the R2 bucket that serves published artifacts."""

    endpoint: str
    bucket: str
    access_key: str
    secret_key: str

    @classmethod
    def from_env(cls) -> R2Config | None:
        """Build from environment, or None if any variable is unset."""
        values = [os.environ.get(key) for key in _R2_KEYS]
        if not all(values):
            return None
        endpoint, bucket, access_key, secret_key = values
        return cls(endpoint, bucket, access_key, secret_key)  # type: ignore[arg-type]
