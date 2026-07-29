# RabbitMQ Events / RabbitMQ event дүрэм

## Naming

```text
domain.entity.action.v1
```

Examples:

```text
identity.user.registered.v1
commerce.order.paid.v1
commerce.entitlement.granted.v1
assessment.attempt.submitted.v1
assessment.result.created.v1
competency.record.updated.v1
programming.submission.judged.v1
cyber.challenge.solved.v1
ai.invocation.completed.v1
```

## Envelope

```text
eventId
eventType
eventVersion
occurredAt
correlationId
causationId
producer
actor
subject
payload
metadata
```

Use Transactional Outbox, publisher confirms, idempotent consumers, retry, DLQ, schema validation, and replay.

Do not publish secrets, raw private documents, large binaries, or unnecessary answers.
