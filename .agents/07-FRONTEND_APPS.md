# Frontend Applications / Frontend application-ууд

## `portal-web`

Contains public pages, authentication, profile, verification, catalogue, commerce, results, learning, organisation, and admin.

## `assessment-web`

Contains launch, readiness, instructions, timer, item rendering, autosave, reconnect, submission, and completion only.

## Launch Flow

```text
portal-web -> entitlement check -> short-lived launch code -> assessment-web -> exchange code -> session
```

Never place long-lived JWT in URL.

## Shared Packages

Use lightweight shared packages for UI primitives, contracts, auth client, config, and observability.
