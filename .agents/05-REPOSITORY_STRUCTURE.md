# Repository Structure / Репозиторийн бүтэц

```text
seek-platform/
├── GEMINI.md
├── .agents/
├── docker-compose.yml
├── docker-compose.dev.yml
├── env/
├── apps/
│   ├── portal-web/
│   └── assessment-web/
├── services/
│   ├── gateway/
│   ├── auth/
│   ├── profile/
│   ├── organisation/
│   ├── verification/
│   ├── competency/
│   ├── assessment/
│   ├── commerce/
│   ├── execution/
│   ├── evaluation/
│   ├── learning/
│   ├── ai/
│   ├── integration/
│   ├── file/
│   ├── reporting/
│   └── platform/
├── packages/
│   ├── contracts/
│   ├── ui/
│   ├── auth-client/
│   ├── config/
│   ├── observability/
│   └── testing/
├── infra/
└── docs/
```

Each service contains `docs/API.md`, `EVENTS.md`, `DATA.md`, and `RUNBOOK.md`.
