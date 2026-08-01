# @seek/portal-web

Portal frontend application for the seek.mn platform.
Built using Next.js App Router, TypeScript, Tailwind CSS, Redux, and Redux-Saga.

## Assessment Runtime Boundary

`portal-web` does not host the production quiz runtime. Candidate entry points
redirect to `assessment-web` by using:

```text
NEXT_PUBLIC_ASSESSMENT_WEB_URL=http://localhost:8082
```

Local default is `http://localhost:8082` when the variable is not set. Production
deployments must set this value to the public assessment runtime domain.
