# Project Roadmap

Canonical roadmap: `.agents/23-ROADMAP.md`.

Use this file for actual priority, owner, milestone, and status.

---

## Current Product Strategy: Frontend-First Platform Prototype

Status: `IN_PROGRESS`

Одоогийн стратеги нь backend service-үүдийг бүрэн implement хийхээс өмнө `portal-web` дээр seek.mn платформын үндсэн UX, role-based navigation, dashboard, assessment lifecycle, candidate-taking flow, result/report preview-г clickable frontend prototype хэлбэрээр баталгаажуулах юм.

Гол шийдвэрүүд:

- Frontend workflow батлагдсаны дараа API contract болон backend service boundary гаргана.
- `@seek/ui` design-system-ийг operational SaaS app foundation болгон тогтворжуулна.
- Backend байхгүй хэсгүүдэд mock data + API adapter ашиглаж, дараа нь real HTTP client руу солих боломжтой бүтэц барина.
- Active task дуусах бүрт `docs/tasks/backup/` руу архивлаж, энэ roadmap дээр шийдвэр болон дараагийн priority-г тэмдэглэнэ.

Current active task:

- `docs/tasks/active-task.md` -> `Frontend-First Platform Prototype`

Next priority:

1. `portal-web` app shell + role-aware navigation.
2. Dashboard mock experience.
3. Assessment list/detail/create workflow.
4. Candidate-taking workflow.
5. Result/report preview.
6. Батлагдсан frontend flow-оос backend API contract гаргах.
