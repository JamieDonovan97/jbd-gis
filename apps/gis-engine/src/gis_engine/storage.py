"""Publishing artifacts to R2 (S3-compatible object storage)."""

from __future__ import annotations

from pathlib import Path

import boto3

from .config import R2Config


def upload(path: Path, key: str, cfg: R2Config) -> str:
    """Upload a file to the R2 bucket.

    Returns the public URL when ``public_base_url`` is configured (what the
    frontend fetches), otherwise an ``s3://`` reference — the S3 endpoint itself
    is auth-only and never publicly readable.
    """
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
    if cfg.public_base_url:
        return f"{cfg.public_base_url.rstrip('/')}/{key}"
    return f"s3://{cfg.bucket}/{key}"
