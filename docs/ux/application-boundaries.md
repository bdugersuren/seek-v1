# Frontend Application Boundaries

## portal-web

`portal-web` нь management/self-service portal байна.

Scope:

- Public home, catalogue, pricing, support
- Authentication, registration, password recovery
- Candidate dashboard, profile, wallet, certificates
- Assessor/admin workspace
- Question bank, blueprint, quiz configuration
- Assignment, monitoring, result/report
- Payment and organisation workflows
- Assessment runtime рүү redirect хийх entry point

Production note:

- `/take/[attemptId]` route нь prototype fallback/demo route байж болно.
- 20,000+ concurrent quiz runtime нь `portal-web` дээр ажиллах ёсгүй.
- Candidate шалгалт эхлүүлэх үед `assessment-web` domain рүү шилжинэ.

## assessment-web

`assessment-web` нь high-concurrency assessment runtime байна.

Scope:

- Join by code
- Waiting room
- Device/browser readiness
- Server-time countdown
- Encrypted payload preload contract
- Start unlock event contract
- Quiz runtime
- Fullscreen/proctoring warning
- Active tab/window violation detection
- Local answer buffer
- 5-second heartbeat/autosave contract
- Reconnect recovery
- Auto-submit
- Submitted receipt
- Locked/connection fallback

Runtime principles:

- Client timer authoritative биш; server `startsAt`, `endsAt`, `serverNow` authoritative байна.
- Browser хаах, network тасрах үед хугацаа сунгахгүй.
- Offline үед local answer buffer хадгалж, online болох үед submit/autosave retry хийнэ.
- Browser-only proctoring нь detect + warn + audit model байна.
- Hard lock шаардвал Safe Exam Browser, LockDown Browser, kiosk mode зэрэг тусдаа roadmap болно.

Deployment principle:

- The assessment application must remain small, stable, and independently deployable.
- `assessment-web` bundle нь portal dashboard/editor dependency-ээс салангид байна.
- Runtime API нь shared `@seek/contracts` interface-д тулгуурлана.
