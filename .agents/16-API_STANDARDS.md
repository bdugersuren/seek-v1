# API Standards / API стандарт

## Base

```text
/api/v1
```

## Requirements

- explicit DTOs;
- server validation;
- stable error codes;
- RFC 7807 problem details;
- cursor pagination;
- idempotency keys;
- optimistic concurrency;
- OpenAPI;
- ownership and organisation scope;
- no ORM exposure.

## Critical Routes

```text
POST /auth/register
POST /auth/sessions
GET  /me/profile
POST /me/employment-placements
POST /verification-requests
GET  /assessment-offers
POST /assessment-offers/{id}/entitlements/check
POST /orders
POST /assessment-attempts
PATCH /assessment-attempts/{id}/responses/{responseId}
POST /assessment-attempts/{id}/submit
GET  /assessment-results/{id}
```

Autosave supports sequence, idempotency, optimistic concurrency, minimal payload, and safe retry.
