# postgres infra

This container runs a local multi-database PostgreSQL instance for the seek.mn
platform.

## Logical Databases

`init-databases.sh` creates these databases when the Postgres volume is empty:

- `auth_db`
- `profile_db`
- `organisation_db`
- `verification_db`
- `competency_db`
- `assessment_db`
- `commerce_db`
- `execution_db`
- `evaluation_db`
- `learning_db`
- `ai_db`
- `integration_db`
- `file_db`
- `notification_db`
- `reporting_db`
- `platform_db`

## Existing Volume Fallback

Docker runs `/docker-entrypoint-initdb.d/init-databases.sh` only during the first
initialization of an empty Postgres volume. If a database is added later and the
volume already exists, create the missing database manually:

```sql
CREATE DATABASE notification_db;
```

From the running container:

```bash
docker compose exec postgres psql -U seek_admin -d seek_core_db
```

Keep service ownership separate: each service connects only to its own logical
database, while `file` stores metadata in `file_db` and binary objects in MinIO.
