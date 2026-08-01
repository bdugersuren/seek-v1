# @seek/assessment-web

Assessment execution frontend application for the seek.mn platform.
Built using Next.js App Router, TypeScript, Tailwind CSS, Redux, and Redux-Saga.

## Runtime Scope

`assessment-web` is the production quiz runtime application. It owns waiting
room, secure start, quiz taking, autosave/heartbeat, reconnect recovery,
submitted receipt, and locked/connection fallback states.

Local dev server:

```text
pnpm --filter @seek/assessment-web dev
```

Default port: `3001`.
