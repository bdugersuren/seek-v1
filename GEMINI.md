# seek.mn — Vibe Coding Engineering Constitution

## Purpose / Зорилго

This file is the root instruction for every Gemini CLI agent, AI coding assistant, and human developer working in this repository.

Энэ файл нь `seek.mn` чадамжийн үнэлгээний платформыг vibe coding аргаар хөгжүүлэх үед архитектур, код, UI/UX, Docker Compose, аюулгүй байдал, өгөгдөл, event, AI болон интеграцийн дүрмийг тогтвортой барих үндсэн баримт бичиг юм.

The platform must support:

- self-registration;
- verified and unverified users;
- personal, academic, membership, and employment history;
- one current primary `ACTIVE` placement under policy;
- free and paid assessments;
- limited and unlimited availability;
- public, targeted, invitation-only, and organisation-commissioned assessments;
- orders, payment, coupons, campaigns, subscriptions, licences, and entitlements;
- assessment execution for 20,000+ concurrent users;
- explainable scoring and competency decisions;
- learning recommendations;
- verified/unverified reporting;
- local AI through Ollama;
- DMOJ, CTFd, Nextcloud, MinIO, RabbitMQ, Redis;
- Docker Compose profiles for selective environments.

## Mandatory Reading Order / Заавал унших дараалал

1. `.agents/SYSTEM_RULES.md`
2. `.agents/00-INDEX.md`
3. `.agents/01-PRODUCT_VISION.md`
4. `.agents/02-ARCHITECTURE.md`
5. `.agents/03-DOMAIN_GLOSSARY.md`
6. `.agents/04-SERVICE_BOUNDARIES.md`
7. `.agents/05-REPOSITORY_STRUCTURE.md`
8. `.agents/06-DOCKER_COMPOSE_PROFILES.md`
9. `.agents/07-FRONTEND_APPS.md`
10. `.agents/08-ASSESSMENT_RUNTIME.md`
11. `.agents/09-PROFILE_HISTORY.md`
12. `.agents/10-ASSESSMENT_COMMERCE.md`
13. `.agents/11-VERIFICATION_REPORTING.md`
14. `.agents/12-AI_OLLAMA_RAG.md`
15. `.agents/13-INTEGRATIONS.md`
16. `.agents/14-EVENTS_RABBITMQ.md`
17. `.agents/15-DATABASE_RULES.md`
18. `.agents/16-API_STANDARDS.md`
19. `.agents/17-SECURITY_PRIVACY.md`
20. `.agents/18-OBSERVABILITY.md`
21. `.agents/19-TESTING_LOAD.md`
22. `.agents/20-DOCUMENTATION_POLICY.md`
23. `.agents/21-AGENT_WORKFLOW.md`
24. `.agents/22-DEFINITION_OF_DONE.md`
25. `.agents/23-ROADMAP.md`

Conflict precedence:

1. latest explicit human instruction;
2. `.agents/SYSTEM_RULES.md`;
3. this `GEMINI.md`;
4. accepted ADRs under `docs/adr/`;
5. module-specific documents;
6. current implementation;
7. AI assumptions.

Never silently resolve a conflict. Explain it in Mongolian and request approval.

## Language Rule / Хэлний дүрэм

All explanations, plans, reviews, architecture proposals, task reports, questions, and development guidance MUST be written in Mongolian.

Keep in English: code, identifiers, service names, API routes, event names, database objects, folder names, commit messages, configuration keys, and canonical technical standards.

## Mandatory Human Approval Gate / Хүний зөвшөөрөл

The agent MUST NOT create or modify project files, execute migrations, start containers, install dependencies, or run mutating commands without explicit human approval.

Before implementation, provide:

1. task interpretation;
2. scope and non-goals;
3. detailed execution plan;
4. affected applications and services;
5. proposed files and folders;
6. UI, API, event, database, security, reporting, and infrastructure impact;
7. options and trade-offs;
8. test plan;
9. rollback or recovery plan.

End with:

> Төлөвлөгөөг зөвшөөрч байна уу? Баталгаажуулна уу.

## Frontend Architecture / Frontend бүтэц

Use two frontend applications:

```text
apps/
├── portal-web/
└── assessment-web/
```

`portal-web` contains public, auth, profile, catalogue, commerce, result, learning, organisation, and admin pages.

`assessment-web` contains readiness, launch, timer, item rendering, autosave, reconnect, submission, and completion only.

`auth-web` is not separate. Authentication pages belong to `portal-web`; backend `auth` remains independent.

## Concurrent Assessment Requirement / 20,000+ хэрэглэгч

Required characteristics:

- independent `assessment-web`;
- stateless `execution` instances;
- durable responses in `execution_db`;
- Redis only for short-lived state;
- debounced and jittered autosave;
- client sequence numbers;
- idempotent submission;
- asynchronous evaluation through RabbitMQ;
- CDN for static assets;
- no AI dependency in critical runtime;
- independent scaling of `gateway`, `assessment-web`, `execution`, and `evaluation-worker`;
- load testing.

## Service Set / Сервисийн багц

```text
gateway
auth
profile
organisation
verification
competency
assessment
commerce
execution
evaluation
learning
ai
integration
file
reporting
platform
```

Each service has one clear responsibility, its own data ownership, API/event contracts, health endpoints, and documentation.

## Docker Compose Strategy / Docker Compose стратеги

Use one root `docker-compose.yml` plus `docker-compose.dev.yml`.

Profile-less core services:

```text
postgres
redis
rabbitmq
minio
auth
gateway
```

Profiles:

```text
frontend
assessment
commerce
ai
integration
dmoj
ctfd
nextcloud
observability
admin
dev
```

All containers connect to external `shared-net`.

Compose profiles select services; they do not autoscale. Production 20,000+ requires Kubernetes or equivalent orchestration.

## Database-per-Service / Өгөгдлийн тусгаарлалт

Each business service owns a database. Cross-service SQL, foreign keys, mutable shared tables, and importing another service ORM model are forbidden.

## File Policy / Файлын бодлого

Large files use MinIO Presigned URLs. Never stream large files through business APIs.

## Commerce Rule / Худалдааны дүрэм

Separate content, offer, entitlement, order, payment, attempt, and result. Payment grants access only and never changes competency, confidence, verification, or certification.

## Verification Rule / Баталгаажуулалтын дүрэм

Verification is never a single boolean. Reports must support verified-only, unverified-only, combined breakdown, comparison, and custom policy modes.

## AI Rule / AI дүрэм

All AI calls go through `ai`. Initial provider is Ollama. Core services never call Ollama directly. AI never makes final certification, identity verification, fraud, or appeal decisions.

## Integration Rule / Интеграцийн дүрэм

DMOJ, CTFd, Nextcloud, payment providers, LMS, and messaging providers are accessed only through `integration` adapters.

## Documentation Policy / Баримт бичгийн бодлого

- Global decisions: `docs/adr/`
- ERD: `docs/ERD/*.mermaid`
- Service API: `services/[service]/docs/API.md`
- Events: `docs/events/`
- Integrations: `docs/integrations/`
- Prompts: `docs/prompts/`
- Runbooks: `docs/runbooks/`
- Tasks: `docs/tasks/`

## Completion Report / Ажлын дараах тайлан

Report in Mongolian: summary, affected components, files, domain rules, UI/API/events, migrations, Compose/profile changes, security, tests, health/load results, limitations, rollback, and next tasks.
