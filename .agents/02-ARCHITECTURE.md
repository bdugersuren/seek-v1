# Architecture / Архитектур

## Target

```text
Two Frontend Applications
+ Sixteen Backend Services
+ Database-per-Service
+ RabbitMQ Events
+ Redis Runtime Support
+ MinIO Object Storage
+ Docker Compose Profiles
+ Future Kubernetes
```

## Communication

Use synchronous REST for immediate operations and RabbitMQ for payment confirmation, attempt submission, scoring, competency updates, recommendations, notifications, and projections.

## Failure Isolation

AI, reporting, Nextcloud, notifications, and unrelated integrations must not block autosave or submission.

## Production Direction

Compose is for local, integration, controlled staging, and load-test environments. Production 20,000+ moves to Kubernetes or equivalent orchestration.
