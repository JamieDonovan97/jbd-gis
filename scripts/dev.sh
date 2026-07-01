#!/usr/bin/env bash
set -euo pipefail

COMPOSE="docker compose -f infra/docker-compose.yml"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

case "${1:-help}" in
  db)
    echo "Starting Postgres..."
    cd "$ROOT" && $COMPOSE up postgres -d
    echo "Ready at localhost:${POSTGRES_PORT:-5432}"
    ;;
  api)
    echo "Starting API (dotnet watch)..."
    cd "$ROOT/apps/gis-api" && dotnet watch run
    ;;
  web)
    echo "Starting frontend (Vite)..."
    cd "$ROOT/apps/gis-web" && npm run dev
    ;;
  down)
    cd "$ROOT" && $COMPOSE down
    ;;
  setup)
    echo "Enabling git hooks (core.hooksPath=.githooks)..."
    git -C "$ROOT" config core.hooksPath .githooks
    chmod +x "$ROOT"/.githooks/* 2>/dev/null || true
    echo "Done — docs/structure.md will now auto-update on commit."
    ;;
  *)
    echo "Usage: ./scripts/dev.sh [setup|db|api|web|down]"
    ;;
esac
