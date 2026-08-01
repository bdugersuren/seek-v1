# Active Task: Assessment Attempt Service Backend Foundation

Status: `COMPLETED`

Энэхүү task-ийн зорилго нь `assessment-web` runtime contract-ийг бодит backend service boundary-д холбох эхний foundation-г төлөвлөж хэрэгжүүлэх юм. Энэ шатанд full production Redis/WebSocket/RabbitMQ deployment хийхгүй; харин service API contract, DTO, mock/in-memory adapter, Redis/queue integration seam, local dev validation flow-г backend implementation-д бэлэн болгоно.

---

## Summary

Frontend талд `assessment-web` runtime, persistence, adapter, realtime event contract бэлэн болсон. Одоо backend талд attempt session, waiting room, heartbeat, autosave, submit, violation event, reconnect recovery-г даах service boundary-г тодорхой болгоно.

Default шийдвэрүүд:

- Server authoritative timer: `startsAt`, `endsAt`, `serverNow`.
- Redis target: active attempt state, latest answer snapshot, heartbeat, violation counters.
- Queue target: answer events, submit events, violation audit, scoring jobs.
- WebSocket/SSE target: unlock, force-submit, warning, locked, server-time events.
- Initial implementation can use in-memory/mock infrastructure adapter with Redis/queue interface seam.

## Gate A: Backend Boundary Audit

- [x] Existing backend apps/services, gateway, docker compose profile, package scripts шалгах.
- [x] Attempt/runtime service аль app/service-д байрлахыг тодорхойлох.
- [x] Existing auth/session contract-той candidate attempt token boundary нийцүүлэх.

Acceptance:

- Backend runtime foundation хаана байрлах, ямар service boundary-той байх нь тодорхой байна.

## Gate B: Contract DTO Alignment

- [x] `@seek/contracts` runtime types дээр backend request/response DTO compatibility шалгах.
- [x] `getSession`, `preloadPayload`, `heartbeat`, `autosave`, `submit`, `recordViolation`, `recoverSession` endpoint contract бичих.
- [x] Idempotency key, local/server version, pending submit behavior тодорхойлох.

Acceptance:

- Frontend runtime adapter real HTTP client болгоход endpoint shape ойлгомжтой байна.

## Gate C: Attempt State Store Seam

- [x] `AttemptStateStore` interface тодорхойлох.
- [x] In-memory implementation нэмэх.
- [x] Redis implementation placeholder/seam тодорхойлох.
- [x] Timer, latest answers, heartbeat, violation counter state key strategy бичих.

Acceptance:

- Redis оруулахад service logic дахин бичихгүй.

## Gate D: Event Queue Seam

- [x] `AttemptEventPublisher` interface тодорхойлох.
- [x] In-memory/noop publisher нэмэх.
- [x] Queue event names: answer autosaved, attempt submitted, violation recorded, scoring requested.
- [x] RabbitMQ/Kafka target mapping docs/task дээр тэмдэглэх.

Acceptance:

- Queue worker дараагийн task дээр шууд залгах боломжтой байна.

## Gate E: Realtime Gateway Contract

- [x] Runtime event constants backend-side mapping бэлдэх.
- [x] WebSocket/SSE transport decision notes бичих.
- [x] Unlock, force-submit, warning, locked, server-time broadcast contract тодорхойлох.
- [x] HTTP fallback endpoint behavior баталгаажуулах.

Acceptance:

- Realtime gateway implementation task decision-complete болно.

## Gate F: Local Validation

- [x] `pnpm typecheck` эсвэл scoped backend/package typecheck.
- [x] Холбогдох lint/test боломжтой бол ажиллуулах.
- [x] Docker/local dev impact тэмдэглэх.
- [x] `docs/tasks/active-task.md` checklist шинэчлэх.

Manual QA:

- Attempt session contract frontend adapter-тэй нийцэх.
- Heartbeat response server authoritative timer-тэй байх.
- Autosave idempotency/version behavior тодорхой байх.
- Submit idempotent final receipt contract-той байх.

## Out Of Scope

- Full Redis cluster deployment.
- Full RabbitMQ/Kafka deployment.
- Production WebSocket scaling.
- Real encrypted payload cryptography.
- Scoring worker full implementation.
