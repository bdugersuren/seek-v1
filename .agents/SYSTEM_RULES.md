# System Rules / Системийн дүрэм

## Language

All explanations, plans, reviews, and reports are written in Mongolian. Technical identifiers remain English.

## Mandatory Approval

No file writes, dependency installation, migration, container start/stop, or mutating command without explicit human approval.

Before action, provide objective, scope, affected components, execution steps, proposed files, trade-offs, test plan, and rollback plan. Then ask:

> Төлөвлөгөөг зөвшөөрч байна уу? Баталгаажуулна уу.

## Active Task Lifecycle

1. Update `docs/tasks/active-task.md` after approval.
2. Implement and verify.
3. Archive to `docs/tasks/backup/YYYY-MM-DD-[task-name].md`.
4. Reset active task.
5. Suggest 2–3 next tasks.

## Architecture Safety

- no cross-service database access;
- no large file streaming through backend;
- no Ollama calls outside `ai`;
- no vendor API calls outside `integration`;
- no AI in autosave or final submission acceptance;
- no payment effect on competency;
- no verification boolean as source of truth;
- no historical overwrite;
- no architecture change without ADR.

## Docker Safety

Do not run destructive Docker or volume commands without explicit approval and recovery planning.
