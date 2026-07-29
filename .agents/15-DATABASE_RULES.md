# Database Rules / Өгөгдлийн сангийн дүрэм

Each business service owns a database or isolated logical database.

## Local

One PostgreSQL instance may host separate databases with separate users.

## Production Separation Priority

```text
auth_db
commerce_db
execution_db
evaluation_db
reporting_db
```

## Forbidden

- cross-service SQL;
- cross-database foreign keys;
- shared mutable business tables;
- another service ORM imports;
- manual production schema edits.

## Temporal Fields

```text
validFrom
validTo
status
source
changeReason
createdAt
updatedAt
version
```

Use expand-and-contract migrations with approval, test, and recovery plan.
