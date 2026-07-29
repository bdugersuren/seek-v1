# Testing and Load / Тест ба ачааллын шалгалт

## Layers

- domain unit;
- application;
- repository integration;
- API contract;
- event contract;
- component;
- E2E;
- migration;
- security;
- load;
- resilience.

## Critical E2E

Registration, profile history, active placement resolution, free/paid entitlement, launch, autosave, reconnect, idempotent submit, async evaluation, result, verified/unverified report, MinIO upload.

## Load Stages

```text
500 -> 2,000 -> 5,000 -> 10,000 -> 20,000 -> failure point
```

Simulate item delivery, jittered autosave, reconnect, simultaneous submit, Redis pressure, DB pressure, RabbitMQ backlog, and evaluation workers.

Success requires zero lost confirmed answers and zero effective duplicate final submissions.
