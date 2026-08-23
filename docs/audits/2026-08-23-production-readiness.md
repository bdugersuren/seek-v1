# SEEK platform — Production-readiness audit

**Snapshot:** 2026-08-23 (Asia/Ulaanbaatar)

**Audience:** platform engineering, security, and release owners
**Scope:** repository configuration and the currently running Docker Compose stack. No application or infrastructure configuration was changed during this audit.

## Executive decision

**Recommendation: do not promote the current Compose configuration to an internet-facing production deployment yet.** The core product path is demonstrably running, but it has release-blocking configuration risks: known/default credentials can be used when environment variables are absent, the file service disables TLS verification, the development Compose overlay is invalid, and several critical dependencies have no health/readiness contract.

The current environment is suitable for active integration development after the priority-zero items below are closed. It is not yet evidence-backed as a production deployment: the observed frontend containers run `next dev`, and only a subset of services has Docker health checks.

## Evidence and confidence

| Check | Result | Confidence |
| --- | --- | --- |
| Base Compose render (`docker compose config --quiet`) | Pass | High |
| Production overlay render (`-f docker-compose.yml -f docker-compose.prod.yml`) | Pass | High |
| Development overlay render | **Fail:** `qdrant` has neither `image` nor `build` | High |
| Running Compose services | 14 long-running services; `node-modules-init` exited 0 | High |
| Docker health status | PostgreSQL, Auth, Gateway, Portal healthy; others have no Docker healthcheck | High |
| HTTP probes | Auth health/live/ready, Gateway health, Portal root: 200; Assessment web root: 307; five internal domain `/health` probes: 200 | High |
| Full host typecheck | Not run: `pnpm` is absent on the host | High |
| Full unit/integration/e2e suite | Not run in this audit | Not verified |

Runtime evidence was collected at the time above. It demonstrates liveness, not correctness under load, failure recovery, authorization boundaries, or backup recovery.

## Architecture and ownership map

```text
Internet
  └─ Nginx Proxy Manager (80, 81, 443)
       ├─ Portal Web (Next.js, :8081) ─┐
       ├─ Assessment Web (Next.js, :8082) ─┤
       └─ Gateway (NestJS, :3010) ────────┼─ Auth (:3020)
                                           ├─ Profile (:3030) ─ File (:3140) ─ MinIO
                                           ├─ Organisation (:3040)
                                           ├─ Assessment (:3070)
                                           └─ Execution (:3090) ─ Redis / RabbitMQ

All stateful domain services ── PostgreSQL (separate logical databases)
```

- The monorepo uses pnpm workspaces and Turborepo. `apps/portal-web` and `apps/assessment-web` are Next.js 14 frontends; active backends are NestJS 10 services.
- Shared package boundaries are `@seek/contracts`, `@seek/ui`, `@seek/auth-client`, `@seek/config`, `@seek/testing`, and `@seek/observability`.
- PostgreSQL holds separate logical databases (`auth_db`, `profile_db`, `organisation_db`, `assessment_db`, `execution_db`, `file_db`, and planned databases). This matches the database-per-service architectural intent, but all databases share one PostgreSQL availability and backup boundary.
- The gateway is the intended HTTP policy and routing boundary. Nginx Proxy Manager is the public TLS/host-routing boundary.

## Service catalog

| Component | Runtime status | State/dependencies | Health/readiness | Public/ingress |
| --- | --- | --- | --- | --- |
| PostgreSQL | Up, Docker healthy | `postgres_data`; logical service DBs | `pg_isready` | **Public `0.0.0.0:5432` in observed stack** |
| Redis | Up | `redis_data`; Execution | No Docker healthcheck | Internal in observed stack |
| RabbitMQ | Up | `rabbitmq_data`; Execution | No Docker healthcheck | Internal in observed stack |
| MinIO | Up | `minio_data`; File | No Docker healthcheck | Internal in observed stack |
| Auth | Up, Docker healthy | `auth_db` | `/health`, `/health/live`, `/health/ready` | localhost :3020, via Gateway |
| Gateway | Up, Docker healthy | Auth and downstream URLs | `/health` | localhost :3010, public via proxy |
| Profile | Up | `profile_db`, File, planned Integration | `/health*` endpoint responds 200; no Docker healthcheck | Gateway |
| Organisation | Up | `organisation_db` | `/health*` endpoint responds 200; no Docker healthcheck | Gateway |
| Assessment | Up | `assessment_db` | `/health` responds 200; no Docker healthcheck | Gateway |
| Execution | Up | `execution_db`, Redis, RabbitMQ | `/health` responds 200; no Docker healthcheck | Gateway/direct internal |
| File | Up | `file_db`, MinIO | `/health` responds 200; no Docker healthcheck | Gateway and files host |
| Portal Web | Up, Docker healthy | Gateway | root responds 200 | localhost :8081, proxy |
| Assessment Web | Up | Execution/API | root responds 307; no Docker healthcheck | localhost :8082, proxy |
| Nginx Proxy Manager | Up | checked-in bind-mounted runtime data/cert data | No Docker healthcheck | **Public 80, 81, 443** |
| Commerce, Notification, Reporting, Integration | Not deployed (commented in base Compose) | Declared downstream by Gateway/Profile | Not verifiable | Gateway has URLs for these services |
| AI, Ollama, Qdrant, Verification, Competency, Evaluation, Learning, Platform | Scaffolded/commented | Not deployed | Not verifiable | No active ingress |

`node-modules-init` exited successfully, which is correct for a one-shot installer. Its use as a required runtime dependency should remain limited to development.

## Compose and runtime findings

### Critical

| Finding | Evidence and impact | Owner | Required remediation / acceptance check |
| --- | --- | --- | --- |
| Production secrets have usable fallback values | `docker-compose.yml` and `docker-compose.prod.yml` supply defaults for PostgreSQL, Redis, RabbitMQ, MinIO, and JWT secrets. A production deployment without a complete environment can start with known credentials. | Platform + Security | Make every production secret required (Compose `${VAR:?message}` or an approved secret provider); remove code fallbacks for production; CI must fail on missing/placeholder secrets. |
| TLS peer verification is disabled for File | `NODE_TLS_REJECT_UNAUTHORIZED: "0"` is set on File. This accepts invalid TLS certificates for all Node TLS calls in that container. | File + Security | Remove the variable; install/declare the required CA chain; prove upload, download, and presigned URL flows with normal certificate verification. |

### High

| Finding | Evidence and impact | Owner | Required remediation / acceptance check |
| --- | --- | --- | --- |
| Development Compose cannot render | `docker-compose.dev.yml` adds ports to `ollama` and `qdrant`, but both services are commented out in the base file. Compose exits with an invalid-service error. | Platform | Either activate the base services behind an `ai` profile or move/remove their dev overrides. `docker compose -f ...yml -f ...dev.yml config --quiet` must pass in CI. |
| PostgreSQL is exposed on every host interface | Base Compose maps `5432:5432`; the observed stack confirms `0.0.0.0:5432`. The dev overlay adds a loopback mapping but does not override the base mapping. | Platform + Security | Bind only to `127.0.0.1` for local development, or remove the host port for deployed environments; verify with `docker ps` and a remote-host negative connection test. |
| No readiness contract for most dependencies | Redis, RabbitMQ, MinIO, Profile, Organisation, Assessment, Execution, File, Assessment Web, and proxy have no Docker healthcheck. `depends_on: service_started` can release consumers before their dependencies are usable. | Service owners + Platform | Add liveness/readiness endpoints and Compose healthchecks; make dependency conditions use healthy readiness where justified; test cold start and dependency restart. |
| Gateway/deployment drift | Gateway declares routes for Commerce, Notification, Reporting, and Integration while those services are commented out. Profile also calls Integration. Requests can fail at runtime with an opaque proxy error. | Gateway + Product domain owners | Declare a service availability registry or remove/feature-gate unavailable routes; contract tests must prove every published gateway route has a deployed target. |
| Backup/restore is not automated in repository | No repository-managed backup, restore, retention, or recovery drill workflow was found for PostgreSQL, MinIO, Redis, or RabbitMQ data. Named Docker volumes alone are not backups. | Platform/SRE | Define encrypted backups, RPO/RTO, retention, ownership, and a scheduled restore drill; attach evidence to release readiness. |

### Medium

| Finding | Evidence and impact | Owner | Required remediation / acceptance check |
| --- | --- | --- | --- |
| Current stack is development-mode frontend runtime | Logs show both frontends start with `next dev`; this has watch-mode behavior and does not validate production image/start performance. | Frontend + Platform | Run the production overlay with built images and `next start`; record cold start, routing, and asset/API smoke results. |
| Execution message-consumer warning | Startup log includes `RabbitMQ Consumer] Channel not initialized. Skipping subscription.` The service stays live, but asynchronous work may be absent. | Execution | Fail readiness if required consumers are disconnected; expose queue/consumer metric and add publish-to-consume integration test. |
| Redis host kernel warning | Redis logs warn that `vm.overcommit_memory` is disabled, which can make persistence/replication fail under memory pressure. | Platform/SRE | Set and document the host kernel value or managed-service equivalent; validate persistence under controlled load. |
| Proxy admin UI is internet-reachable by port mapping | Nginx Proxy Manager maps port 81 on all interfaces. It needs network access controls and strong administrative identity. | Platform + Security | Restrict port 81 to VPN/admin networks or localhost; rotate initial credentials and verify unauthorised access is blocked. |
| Observability package is only a scaffold | `@seek/observability` exposes a basic logger surface; no platform metrics, distributed tracing, alert rules, SLOs, or central log retention were found. | Platform/SRE | Implement structured correlation IDs, metrics, traces, dashboards, and alerts for auth, gateway, assessment execution, queue lag, DB, and object storage. |
| Dependency versions need lifecycle management | Logs report a Prisma major upgrade available; Node 18 and package versions are pinned at the workspace level. | Engineering enablement | Maintain a scheduled dependency/security update process with compatibility tests; do not upgrade Prisma major versions without a migration plan. |

### Low / engineering hygiene

- Nginx Proxy Manager runtime database and log files are tracked/modified under `docker/nginx-proxy/data`. Separate mutable runtime data from repository-controlled declarative configuration, redact any sensitive state, and ignore generated logs.
- Compose documentation describes profiles that are currently mostly commented out. Reconcile the runbook with the effective Compose model.
- The host development environment lacks `pnpm`; document the supported local bootstrap path or provide a dev container/toolchain check.

## Security and data lifecycle assessment

- Authentication has useful controls already present: JWT issuer/audience configuration, token/CSRF documentation, refresh/session handling, bcrypt password hashing, and rate-limit code/tests.
- Those controls are undermined operationally if the Compose default JWT secret reaches production. The production security-config validation should be the only accepted execution path, and secrets must never be logged. (The current Auth security helper contains a debug statement that prints the JWT secret value; remove it before production.)
- File metadata is stored in `file_db`; object data is stored in MinIO. A recovery plan must preserve database/object consistency and verify presigned URLs after restore.
- PostgreSQL is one container with distinct databases, not independently deployable databases. Capacity, backup, failover, and restore planning must treat it as a shared critical dependency.

## Quality and release evidence

The repository has unit tests across active and scaffolded services, gateway/auth tests, frontend component tests, and Playwright/integration tests for authentication and assessment flows. The root scripts provide `typecheck`, `lint`, `test`, smoke, integration, Postman, and e2e entry points.

This audit did **not** treat test presence as a passing release signal. The root `pnpm typecheck` command could not run on the host because `pnpm` was unavailable; the full test suite was deliberately not run against the persistent shared runtime stack. A release pipeline must produce fresh, isolated evidence for the following gates:

1. `pnpm install --frozen-lockfile`, typecheck, lint, unit tests, and package build.
2. Base, dev, and production Compose render validation.
3. Built-image startup with migrations, all readiness checks green, and no warning-level required dependency failures.
4. Auth, portal assessment authoring, scheduled assessment, runtime autosave/submit, File/MinIO, and gateway route smoke tests.
5. Security scan for committed secrets, placeholder secrets, disabled TLS verification, public management ports, and vulnerable images/dependencies.
6. Backup restore drill and controlled restart of PostgreSQL, Redis, RabbitMQ, MinIO, and Execution.

## Prioritized remediation roadmap

### P0 — block release

1. Replace all production default credentials and JWT fallback values with required secret injection; rotate any credentials that may already have been used.
2. Remove global TLS-verification disablement from File and validate the trusted certificate chain.
3. Fix the dev Compose `qdrant`/`ollama` render failure and add Compose rendering to CI.
4. Close public PostgreSQL exposure and restrict the Nginx Proxy Manager admin port.

### P1 — required before reliable production operation

1. Add a uniform `/health/live` and `/health/ready` contract, Docker healthchecks, and dependency-aware startup/restart handling.
2. Resolve the Execution RabbitMQ consumer initialization warning; make message-path readiness observable and testable.
3. Reconcile Gateway route declarations with deployed service profiles and add gateway-to-service contract checks.
4. Create an owned backup, restore, retention, and recovery-drill runbook for all persistent state.

### P2 — operational maturity

1. Establish CI release gates, image provenance/tagging, and a production-like immutable-image verification environment.
2. Add central structured logs, metrics, traces, dashboards, alerts, and explicit SLOs.
3. Move proxy runtime state out of Git, reconcile documentation, and maintain dependency upgrades through a tested cadence.

## Exit criteria for a production-candidate release

- No placeholder/default secret or TLS-disable setting can reach a production Compose render.
- All active services and required infrastructure report healthy readiness; cold start and restart tests pass.
- Every published gateway route targets an enabled, healthy service or is explicitly feature-gated.
- All persistent stores have a tested restore within the agreed RPO/RTO.
- CI records passing code, image, Compose, security, integration, and e2e evidence from an isolated environment.
- Public network exposure is limited to approved HTTPS endpoints; database and administration interfaces are restricted.
