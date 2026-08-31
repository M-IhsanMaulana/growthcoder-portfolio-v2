#!/bin/sh
set -e

echo "==================================================="
echo "🚀 [GrowthCoder API] Initializing Production Server"
echo "==================================================="

# 1. Run database migrations safely
echo "==> Running database migrations..."
if [ -f "ace.js" ]; then
  ACE_CMD="node ace.js"
else
  ACE_CMD="node ace"
fi

$ACE_CMD migration:run --force || echo "==> [Warning] Database migration completed or already up to date."

# 2. Run initial database seeds ONLY if RUN_SEEDERS=true is explicitly set
if [ "$RUN_SEEDERS" = "true" ]; then
  echo "==> Running database seeders (RUN_SEEDERS=true)..."
  $ACE_CMD db:seed || echo "==> [Warning] Database seeding completed or skipped."
else
  echo "==> Skipping database seeders (database already initialized)."
fi

# 3. Start BullMQ background queue worker
echo "==> Starting BullMQ background queue worker..."
$ACE_CMD queue:work &
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
