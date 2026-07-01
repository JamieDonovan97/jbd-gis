# Batch tier — runs to completion and exits. No server, no EXPOSE, no daemon.
# rasterio's wheels bundle GDAL, but its GDAL still links libexpat at runtime,
# which python-slim omits — so the runtime stage installs that one system lib.
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS build
WORKDIR /app
ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy
COPY pyproject.toml uv.lock* ./
RUN uv sync --no-install-project --no-dev
COPY . .
RUN uv sync --no-dev

FROM python:3.12-slim AS runtime
RUN apt-get update \
    && apt-get install -y --no-install-recommends libexpat1 \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app /app
ENV PATH="/app/.venv/bin:$PATH"
ENTRYPOINT ["gis-engine"]
