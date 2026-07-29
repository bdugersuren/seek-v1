# ADR-0001: Two Frontend Applications

Status: Proposed

## Decision

Use `portal-web` and `assessment-web`. Authentication pages remain in `portal-web`.

## Reason

20,000+ concurrent assessment users require independent scaling, release isolation, smaller runtime bundle, and assessment-specific security.

Human approval is required before accepting this ADR.
