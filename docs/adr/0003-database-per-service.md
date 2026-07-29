# ADR-0003: Database-per-Service

Status: Proposed

Each business service owns a database or isolated logical database. Cross-service database access is forbidden.

Local development may use one PostgreSQL instance with separate databases and users.
