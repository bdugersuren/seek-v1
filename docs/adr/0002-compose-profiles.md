# ADR-0002: One Docker Compose Model with Profiles

Status: Proposed

## Decision

Use one root `docker-compose.yml`, one `docker-compose.dev.yml`, and profiles:

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

## Consequence

Selective environments become simple, but profile dependency graphs must remain valid. Profiles are not autoscaling.
