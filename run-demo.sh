#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="demo-compose.yml"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required to run the demo stack." >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose v2 is required (docker compose)." >&2
  exit 1
fi

echo "Starting KarikaRide demo (frontend + API + MySQL with seed data)..."
docker compose -f "$COMPOSE_FILE" up --build
