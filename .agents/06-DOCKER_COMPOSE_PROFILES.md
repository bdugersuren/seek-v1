# Docker Compose Profiles / Docker Compose profile зохион байгуулалт

## Files

```text
docker-compose.yml
docker-compose.dev.yml
```

## Profile-less Core

```text
postgres
redis
rabbitmq
minio
auth
gateway
```

## Profiles

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

## Commands

Core:

```bash
docker compose up -d
```

Frontend mock:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile frontend up -d
```

Full assessment:

```bash
docker compose --profile frontend --profile assessment up -d
```

Assessment with AI:

```bash
docker compose --profile frontend --profile assessment --profile ai up -d
```

DMOJ:

```bash
docker compose --profile assessment --profile integration --profile dmoj up -d
```

## `shared-net`

All containers connect to external `shared-net`.

## Dependency Safety

Production `assessment-web` belongs to `assessment` and depends on `execution`.

Development override enables mock `assessment-web` under `frontend`, sets mock mode, and removes backend dependency.

Profiles select services; they do not autoscale.
