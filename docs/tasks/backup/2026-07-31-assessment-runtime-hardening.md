# Archived Task: Assessment Runtime Hardening

Status: `COMPLETED`

Completed: `2026-07-31`

## Completion Summary

`assessment-web` runtime mock prototype-оос real API/WebSocket/IndexedDB-ready frontend foundation руу ойртлоо. Runtime state persistence, adapter boundary, realtime event constants, UX polish, portal boundary cleanup, validation gate-үүд бүрэн хийгдсэн.

Completed work:

- Runtime snapshot persistence abstraction нэмсэн.
- IndexedDB best-effort primary write + localStorage fallback cache нэмсэн.
- Runtime hook-ийг mock data-аас салгаж `mockRuntimeAdapter` ашиглуулсан.
- Adapter methods: `getSession`, `preloadPayload`, `heartbeat`, `autosave`, `submit`, `recordViolation`, `recoverSession`.
- Realtime event constants and payload mapping нэмсэн.
- Runtime local restore, stale/expired pending submit policy нэмсэн.
- Portal candidate entry links `NEXT_PUBLIC_ASSESSMENT_WEB_URL` contract ашигладаг болсон.
- `portal-web /take/[attemptId]` fallback/demo notice нэмсэн.
- Runtime env guidance README-д нэмсэн.

Validation completed:

- `pnpm --filter @seek/contracts typecheck`
- `pnpm --filter @seek/assessment-web typecheck`
- `pnpm --filter @seek/assessment-web lint`
- `pnpm --filter @seek/assessment-web build`
- `pnpm --filter @seek/portal-web typecheck`
- `pnpm --filter @seek/portal-web lint`

## Final Decisions

- `assessment-web` remains the production runtime app.
- `portal-web /take/[attemptId]` remains temporary fallback/demo.
- Runtime transport remains adapter-based, with HTTP fallback required.
- Browser persistence uses localStorage as synchronous restore cache and IndexedDB as best-effort primary browser store.
- Realtime event names are fixed for next backend/realtime task.

