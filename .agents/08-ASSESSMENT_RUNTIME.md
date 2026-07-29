# Assessment Runtime / 20,000+ зэрэг хэрэглэгч

## Critical Path

```text
assessment-web -> gateway -> execution -> Redis -> execution_db
```

## Stateless Rule

Authoritative session data must not live in container memory.

## Autosave

Use changed-response payload, debounce, random jitter, sequence number, idempotency, optimistic concurrency, offline retry, and visible save state.

Older sequence must never overwrite a newer response.

## Submission

Submission is idempotent. Return after durable acceptance, not after scoring.

## Scale

Scale `assessment-web`, `gateway`, `execution`, and `evaluation-worker` independently.

## Initial Targets

```text
item delivery p95 < 500 ms
autosave p95 < 750 ms
submission acceptance p95 < 1 second
lost confirmed responses = 0
effective duplicate submissions = 0
```

Validate by load testing; these are not guarantees.
