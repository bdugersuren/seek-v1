# Archived Task: Assessment Runtime Split & 20k Concurrent Quiz Readiness

Status: `COMPLETED`

Completed: `2026-07-31`

## Completion Summary

`portal-web` дээр нэгтгэн загварчилсан candidate quiz runtime-ийг production architecture-д нийцүүлэн `assessment-web` рүү салгах frontend foundation хэрэгжсэн. Энэ task backend/Redis/WebSocket/RabbitMQ-г бүрэн implement хийгээгүй, харин frontend boundary, shared contract, mock runtime state, autosave/timer/reconnect/proctoring policy-ийн interface-ийг тогтоосон.

Completed gates:

- Runtime split plan and `@seek/contracts` assessment runtime types
- `assessment-web` waiting/take/submitted/locked/connection-lost/join runtime routes
- Mock runtime session and `useAssessmentRuntime` foundation
- Countdown, heartbeat, autosave, offline pending submit placeholder
- Encrypted preload + start unlock mock UX
- Fullscreen request, visibility/blur warning, violation counter, lock placeholder
- `portal-web` candidate runtime entry redirects to `assessment-web`
- Boundary documentation updated

Validation completed:

- `pnpm --filter @seek/contracts typecheck`
- `pnpm --filter @seek/assessment-web typecheck`
- `pnpm --filter @seek/assessment-web lint`
- `pnpm --filter @seek/assessment-web build`
- `pnpm --filter @seek/portal-web typecheck`
- `pnpm --filter @seek/portal-web lint`

## Final Decisions

- `assessment-web` is the production quiz runtime app.
- `portal-web /take/[attemptId]` remains temporary fallback/demo only.
- Secure payload default is hybrid encrypted preload + start unlock key.
- Browser-only proctoring uses detect + warn + audit + lock placeholder.
- HTTP fallback remains required alongside future realtime transport.

---

## Original Task

# Active Task: Assessment Runtime Split & 20k Concurrent Quiz Readiness

Status: `COMPLETED`

Энэхүү task-ийн зорилго нь одоогоор `portal-web` дээр нэгтгэн загварчилсан candidate quiz runtime-ийг `assessment-web` рүү салгаж, 20,000+ хэрэглэгч нэгэн зэрэг шалгалт өгөх production architecture-д нийцэх frontend foundation, shared contract, runtime UX flow-г алхам алхамаар хэрэгжүүлэх юм.

Энэ үе шатанд backend/Redis/WebSocket/RabbitMQ-г бүрэн implement хийхгүй. Харин frontend boundary, route, data contract, mock runtime state, autosave/timer/reconnect/proctoring policy-ийн interface-ийг тогтоож, дараагийн backend service implementation-д шууд ашиглагдах хэлбэрээр бэлдэнэ.

## Completed Checklist

### Gate A: Planning & Contract

- [x] `active-task.md`-д runtime split plan бичих
- [x] `packages/contracts` дээр assessment runtime types нэмэх
- [x] Portal/assessment boundary docs-той нийцэл шалгах

### Gate B: Assessment Runtime Shell

- [x] `assessment-web` route structure үүсгэх
- [x] `/waiting/[attemptId]` page нэмэх
- [x] `/take/[attemptId]` page нэмэх
- [x] `/submitted/[attemptId]` page нэмэх
- [x] `/locked`, `/connection-lost` fallback нэмэх

### Gate C: Mock Runtime Engine

- [x] Mock attempt session үүсгэх
- [x] `useAssessmentRuntime` hook нэмэх
- [x] Countdown, heartbeat, autosave state нэмэх
- [x] Offline/pending submit state placeholder нэмэх
- [x] Reconnect recovery contract UI нэмэх

### Gate D: Secure Start UX

- [x] Waiting room payload preload status
- [x] Unlock key pending/received status
- [x] Start event mock transition
- [x] Start-before-time blocked state

### Gate E: Proctoring UX

- [x] Fullscreen request control
- [x] Visibility/blur warning
- [x] Violation counter
- [x] Lock policy placeholder

### Gate F: Portal Integration

- [x] `portal-web` candidate assessment entry-үүдийг `assessment-web` route contract руу чиглүүлэх
- [x] `/take/[attemptId]` prototype fallback гэдгийг UI/docs дээр тэмдэглэх
- [x] `join-assessment` flow assessment domain redirect contract-той болох

### Gate G: Validation

- [x] `pnpm --filter @seek/contracts typecheck`
- [x] `pnpm --filter @seek/assessment-web typecheck`
- [x] `pnpm --filter @seek/assessment-web lint`
- [x] `pnpm --filter @seek/assessment-web build`
- [x] `pnpm --filter @seek/portal-web typecheck`
- [x] `pnpm --filter @seek/portal-web lint`
