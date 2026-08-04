#!/bin/sh
set -e

SERVICE_DIR="${SERVICE_DIR:-$(pwd)}"
APP_ENTRY="${APP_ENTRY:-dist/src/main.js}"
PRISMA_SCHEMA="${SERVICE_DIR}/prisma/schema.prisma"

cd "$SERVICE_DIR"

if [ -f "$PRISMA_SCHEMA" ]; then
  if [ -x /app/node_modules/.bin/prisma ]; then
    PRISMA_LOCK_DIR="${PRISMA_LOCK_DIR:-/app/node_modules/.seek-prisma-setup.lock}"
    while ! mkdir "$PRISMA_LOCK_DIR" 2>/dev/null; do
      sleep 1
    done
    trap 'rmdir "$PRISMA_LOCK_DIR" 2>/dev/null || true' EXIT INT TERM

    /app/node_modules/.bin/prisma generate --schema="$PRISMA_SCHEMA"

    if [ -d "${SERVICE_DIR}/generated" ]; then
      mkdir -p "${SERVICE_DIR}/dist"
      rm -rf "${SERVICE_DIR}/dist/generated"
      cp -r "${SERVICE_DIR}/generated" "${SERVICE_DIR}/dist/generated"
      echo "Copied generated clients to dist/generated successfully."
    fi

    if [ -d "${SERVICE_DIR}/prisma/migrations" ] && [ "$(find "${SERVICE_DIR}/prisma/migrations" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l)" -gt 0 ]; then
      /app/node_modules/.bin/prisma migrate deploy --schema="$PRISMA_SCHEMA"
    else
      echo "No Prisma migrations found for ${SERVICE_DIR}; skipping migrate deploy."
    fi

    if [ "${RUN_SEED:-false}" = "true" ] && [ -f "${SERVICE_DIR}/prisma/seed.ts" ]; then
      /app/node_modules/.bin/ts-node "${SERVICE_DIR}/prisma/seed.ts"
    fi

    rmdir "$PRISMA_LOCK_DIR" 2>/dev/null || true
    trap - EXIT INT TERM
  else
    echo "Prisma CLI not found in shared /app/node_modules; skipping Prisma setup."
  fi
fi

exec node "$APP_ENTRY"
