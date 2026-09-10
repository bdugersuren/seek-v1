#!/bin/sh
set -eu
cd "${SERVICE_DIR:?SERVICE_DIR is required}"
if [ "${1:-}" = "migrate" ]; then
  exec /app/node_modules/.bin/prisma migrate deploy --schema=prisma/schema.prisma
fi
if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "Demo seed is prohibited in production" >&2
  exit 1
fi
exec node "${APP_ENTRY:-dist/src/main.js}"
