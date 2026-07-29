# Service Boundaries / Сервисийн хил

## `gateway`
Routing, rate limiting, correlation ID, request limits, basic token verification. No business database.

## `auth`
Registration, login, JWT, refresh session, MFA, technical roles. Owns `auth_db`.

## `profile`
Person, roles, academic/employment history, ACTIVE placement rules. Owns `profile_db`.

## `organisation`
Directory, units, claims, admins, membership management. Owns `organisation_db`.

## `verification`
Requests, records, policies, expiry, revocation. Owns `verification_db`.

## `competency`
Frameworks, levels, targets, competency history, gap analysis. Owns `competency_db`.

## `assessment`
Definitions, versions, item bank, rubrics, catalogue metadata. Owns `assessment_db`.

## `commerce`
Offers, price, availability, audience, orders, payments, refunds, coupons, campaigns, subscriptions, licences, entitlements. Owns `commerce_db`.

## `execution`
Attempts, sessions, item delivery, autosave, reconnect, timer, submission, runtime integrity. Owns `execution_db`.

## `evaluation`
Automatic scoring, review, DMOJ/CTFd mapping, decision, result explanation. Owns `evaluation_db`.

## `learning`
Catalogue, recommendations, paths, progress, reassessment readiness. Owns `learning_db`.

## `ai`
Ollama/provider abstraction, prompt/model registry, RAG, embeddings, vector search, AI audit. Owns `ai_db`.

## `integration`
DMOJ, CTFd, Nextcloud, payment provider, LMS, identity, email/SMS adapters. Owns `integration_db`.

## `file`
MinIO presigned URLs, metadata, checksum, scan, retention. Owns `file_db`.

## `reporting`
Read models, dashboards, verified/unverified reports, commerce reports, exports. Owns `reporting_db`.

## `platform`
Notification, audit, workflow, scheduler, settings, localisation, support, lightweight search. Owns `platform_db`.
