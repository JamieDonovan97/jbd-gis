"""Publishing artifacts to R2 (S3-compatible object storage)."""

from __future__ import annotations

from pathlib import Path

import boto3

from .config import R2Config


def upload(path: Path, key: str, cfg: R2Config) -> str:
    """Upload a file to the R2 bucket and return its object URL."""
    client = boto3.client(
        "s3",
        endpoint_url=cfg.endpoint,
        aws_access_key_id=cfg.access_key,
        aws_secret_access_key=cfg.secret_key,
        region_name="auto",
    )
    client.upload_file(
        str(path),
        cfg.bucket,
        key,
        ExtraArgs={"ContentType": "application/octet-stream"},
    )
    return f"{cfg.endpoint}/{cfg.bucket}/{key}"
