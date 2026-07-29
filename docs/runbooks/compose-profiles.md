# Runbook — Docker Compose Profiles

Validate:

```bash
docker compose config
```

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

Assessment and AI:

```bash
docker compose --profile frontend --profile assessment --profile ai up -d
```

Never add `-v` to `down` unless volume deletion is explicitly approved.
