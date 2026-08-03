# Backend RBAC Boundary

## Principle

Frontend role guards are only UX routing helpers. Authorization decisions for protected API behavior must be enforced by backend guards after Gateway has verified the JWT.

## Roles

- `SUPER_ADMIN`: platform-wide technical and operational administration.
- `ORGANIZATION_ADMIN`: organisation-scoped administration.
- `ASSESSOR`: assessment, quiz, blueprint, question-bank authoring and result review.
- `VIEWER`: organisation-scoped read-only operational visibility.
- `TESTER`: internal smoke-test and QA account role.
- `CANDIDATE`: catalog, attempts, profile, payments, certificates, and candidate runtime.

## Gateway Identity Contract

After successful JWT verification, Gateway strips inbound spoofable identity headers and writes trusted internal headers:

- `x-user-id`: JWT `sub`
- `x-session-id`: JWT `session_id`
- `x-user-roles`: comma-separated JWT `roles`

Downstream services must treat these headers as trusted only when requests arrive from Gateway/internal network paths.

## Permission Matrix

| Area | Primary roles | Notes |
| --- | --- | --- |
| Platform administration | `SUPER_ADMIN` | Global settings, all organisations, emergency operations. |
| Organisation administration | `SUPER_ADMIN`, `ORGANIZATION_ADMIN` | Organisation admin must be scoped to its own organisation. |
| Assessor workspace | `SUPER_ADMIN`, `ORGANIZATION_ADMIN`, `ASSESSOR` | Quiz, blueprint, assessment, question bank authoring. |
| Results review | `SUPER_ADMIN`, `ORGANIZATION_ADMIN`, `ASSESSOR`, `VIEWER` | `VIEWER` should be read-only. |
| Candidate catalog and attempts | `CANDIDATE` | Candidate-owned resources only. |
| Runtime execution | `CANDIDATE`, `TESTER` | Attempts must additionally validate ownership and attempt token. |
| Health/readiness | public/internal unauthenticated | No user data. |

## Implementation Checklist

- Use Gateway `@Roles(...)` for any Gateway-owned protected controller route.
- For proxied bounded-context services, add equivalent guards in each service before exposing non-health routes.
- Always combine role checks with resource ownership/tenant checks.
- Do not rely on `apps/portal-web/src/components/auth/role-guard.tsx` as a security boundary.
