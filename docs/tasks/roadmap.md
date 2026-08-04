# Project Roadmap

Canonical roadmap: `.agents/23-ROADMAP.md`.

Use this file for actual priority, owner, milestone, and status.

---

## Current Product Strategy: Assessment Runtime Backend Foundation

Status: `READY_FOR_NEXT_TASK`

Одоогийн стратеги нь `assessment-web` runtime contract-ийг backend attempt service boundary-д холбож, 20,000+ хэрэглэгч зэрэг шалгалт өгөх production architecture-ийн server-side foundation-г эхлүүлэх юм.

Гол шийдвэрүүд:

- `portal-web` нь public/catalog/profile/payment/result/assessor-admin management app байна.
- `assessment-web` нь waiting room, runtime, autosave, reconnect, submit receipt бүхий тусдаа runtime app байна.
- Secure payload default нь hybrid encrypted preload + start unlock key.
- Browser-only proctoring нь detect + warn + audit + lock placeholder model байна.
- `portal-web /take/[attemptId]` route түр fallback/demo хэвээр үлдэнэ.
- Frontend runtime adapter бэлэн болсон тул backend нь attempt session, heartbeat, autosave, submit, violation, realtime event boundary-г хангана.
- Redis/queue/WebSocket full production deployment өмнө service seam, DTO, in-memory implementation-аар эхэлнэ.
- Active task дуусах бүрт `docs/tasks/backup/` руу архивлаж, энэ roadmap дээр шийдвэр болон дараагийн priority-г тэмдэглэнэ.

Recently completed:

- `docs/tasks/backup/2026-08-04-assessment-execution-reporting-durable-integration.md` -> `Assessment, Execution, and Reporting Durable Integration`
- `docs/tasks/backup/2026-07-31-assessment-runtime-split-20k-readiness.md` -> `Assessment Runtime Split & 20k Concurrent Quiz Readiness`
- `docs/tasks/backup/2026-07-31-assessment-runtime-hardening.md` -> `Assessment Runtime Hardening`
- `docs/tasks/backup/2026-08-02-enterprise-assessment-runtime-schema-and-flow-hardening.md` -> `Enterprise Assessment Runtime Schema And Flow Hardening`

Current active task:

- `No active task`

Next priority:

- [ ] Add production KMS/token-binding integration for request signatures and unlock keys.
- [ ] Add E2E coverage from catalog start to receipt and reporting fact projection.
- [ ] Run 20,000 concurrent user load testing and tune database indexes / Redis cache layers.

