#!/bin/sh
set -e

echo "==================================================="
echo "🚀 [GrowthCoder API] Initializing Production Server"
echo "==================================================="

# 1. Run database migrations safely
echo "==> Running database migrations (node ace migration:run --force)..."
if ! node ace migration:run --force; then
  echo "==> [Warning] Initial migration attempt failed. Waiting 5 seconds for database readiness..."
  sleep 5
  node ace migration:run --force || echo "==> [Warning] Database migration failed or already up to date. Continuing startup..."
fi

# 2. Start BullMQ background queue worker
echo "==> Starting BullMQ background queue worker..."
node ace queue:work &
WORKER_PID=$!

# Trap signals for graceful shutdown
cleanup() {
  echo "==> Shutting down services gracefully..."
  if [ -n "$WORKER_PID" ]; then
    kill -TERM "$WORKER_PID" 2>/dev/null || true
    wait "$WORKER_PID" 2>/dev/null || true
  fi
  if [ -n "$SERVER_PID" ]; then
    kill -TERM "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
  echo "==> Services shutdown complete."
  exit 0
}

trap cleanup SIGINT SIGTERM

# 3. Start AdonisJS HTTP Server
echo "==> Starting AdonisJS HTTP server on host ${HOST:-0.0.0.0} port ${PORT:-3333}..."
node bin/server.js &
SERVER_PID=$!

# Wait for server process
wait "$SERVER_PID"
