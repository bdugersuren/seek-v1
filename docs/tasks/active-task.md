# Active Task: Production-Ready Frontend Web Prototype

Status: `IN_PROGRESS`

Энэхүү task-ийн зорилго нь `seek.mn` платформын backend service-үүдийг гүнзгий implement хийхээс өмнө **production-д шууд үргэлжлүүлэн ашиглаж болох frontend web foundation** бүрдүүлэх юм. Prototype нь throwaway биш байна: route, layout, state, i18n, theme, modal, notification, responsive behavior, mock API adapter, domain type-ууд нь дараа backend API-тай холбогдоход хадгалагдаж үлдэх бүтэцтэй байна.

---

## 1. Product Strategy

Платформыг дараах дарааллаар хөгжүүлнэ:

1. Frontend application shell, design-system usage, state foundation, i18n, theme, modal, notification, responsive layout-ийг эхэлж тогтворжуулах.
2. Гол workflow-уудыг mock data дээр clickable prototype болгох.
3. Stakeholder review хийж navigation, role, language, theme, modal interaction, notification behavior, responsive UX, data shape-ийг батлах.
4. Батлагдсан frontend flow-оос API contract болон backend service boundary гаргах.
5. Backend service-үүдийг frontend-ийн батлагдсан хэрэгцээнд тулгуурлан implement хийх.

Гол зарчим:

- Backend бүрэн биш үед frontend нь mock data/API adapter ашиглана.
- Mock layer-ийг real backend client-ээр солиход UI component-ууд дахин бичигдэхгүй.
- UI нь production application шиг найдвартай, responsive, accessibility-conscious, theme/i18n ready байна.
- Frontend architecture нь цаашид олон module нэмэгдэхэд задрахгүй feature-based structure-тэй байна.

## 2. Frontend Technology Stack

Frontend web-д дараах stack ашиглана:

- `Next.js` App Router
- `TypeScript`
- `Tailwind CSS`
- Shared `@seek/ui` design-system
- `Redux Toolkit`
- `Redux Saga`
- `React Hook Form`
- `Zod`
- Markdown/MDX rendering
- KaTeX math rendering
- Jest/unit tests
- Playwright browser/e2e tests
- ESLint, Prettier, TypeScript strict checks

State management-ийн зааг:

- Redux Toolkit: auth/session, role, workspace, locale, theme preference, modal registry, notifications, long-running workflow state.
- Redux Saga: login/session restore, logout, assessment autosave, candidate attempt timer/autosave, notification side effects, polling/retry/cancel workflow.
- Local component state: жижиг form control, tab, temporary UI state.

## 3. Primary Users and Roles

Эхний frontend prototype дараах role-уудыг дэмжинэ:

- `Super Admin`: бүх organisation, platform health, billing, global settings харна.
- `Organisation Admin`: байгууллагын хэрэглэгчид, assessment, invite, report удирдана.
- `Assessor`: assessment үүсгэх, candidate progress харах, evaluation хийх.
- `Candidate`: assessment өгөх, өөрийн үр дүн харах.
- `Reviewer/HR`: result, competency summary, candidate report үзэх.

Prototype phase дээр role болон хэрэглэгчийг backend дээр хадгалахгүй байж болно. Role-specific хэрэглэгчдийг frontend mock-data дотор хадгалж, login хийх үед тухайн role-ийн default page рүү redirect хийнэ.

Mock login хэрэглэгчид:

```text
superadmin@lms.local / TestPassword123!  -> /admin
orgadmin@lms.local / TestPassword123!    -> /organisations
assessor@lms.local / TestPassword123!    -> /assessments
candidate@lms.local / TestPassword123!   -> /take/mock-attempt-001
reviewer@lms.local / TestPassword123!    -> /results
tester@seek.local / TestPassword123!     -> backend auth, default assessor flow
```

Backend stage дээр `Reviewer/HR` role-ийг `Reviewer` болон `HR Viewer` permission model болгон салгах эсэхийг дахин үнэлнэ.

## 4. Internationalization Requirements

Frontend нь эхнээсээ i18n-ready байна.

Эхний хэлний scope:

- Монгол хэл: `mn`
- Англи хэл: `en`

Шаардлага:

- UI visible text-үүдийг component дотор hardcode хийхгүй, translation key ашиглана.
- Locale сонголт user preference байдлаар хадгалагдана.
- Language switcher нь authenticated app shell болон login screen дээр харагдана.
- Route, navigation, dashboard, assessment, candidate-taking, result/report, settings screen-ийн үндсэн текстүүд translation-ready байна.
- Date/time/number/percentage formatting нь locale-aware байна.
- Missing translation key-г development үед ил харагдуулах эсвэл fallback strategy-тай байна.

Санал болгож буй бүтэц:

```text
apps/portal-web/src/i18n/
  config.ts
  dictionaries/
    mn.ts
    en.ts
  provider.tsx
  use-t.ts
```

Эхний implementation дээр custom lightweight dictionary ашиглаж болно. Хэрэв route-level locale шаардлага өсвөл `next-intl` эсвэл түүнтэй төстэй library-г тусдаа ADR-аар батална.

## 5. Theme Requirements

Frontend нь theme солих боломжтой байна.

Эхний theme scope:

- `light`
- `dark`
- `system`

Шаардлага:

- Theme preference localStorage эсвэл user preference state-д хадгалагдана.
- `@seek/ui` CSS variable token system-ийг ашиглана.
- Theme switcher нь app shell user/settings area-д байна.
- Login page, dashboard, modal, notification, form, table, assessment-taking screen бүгд light/dark theme дээр уншигдахуйц contrast-тай байна.
- Theme солих үед layout shift үүсэхгүй.
- Tailwind class-ууд semantic token-д суурилна, one-off өнгөний хэрэглээг хязгаарлана.

## 6. Modal and Dialog Requirements

Frontend нь modal цонхнуудыг төвлөрсөн байдлаар удирдах foundation-той байна.

Modal scope:

- Confirm modal
- Form modal
- Details modal
- Full-screen/large workflow modal
- Destructive action confirmation

Шаардлага:

- Modal open/close state нь global modal registry эсвэл reusable hook-оор удирдагдана.
- Focus trap, escape close, backdrop click behavior тодорхой байна.
- Modal title/description accessibility attribute-тай байна.
- Mobile дээр full-screen эсвэл bottom-sheet style responsive behavior ашиглаж болно.
- Nested modal-оос аль болох зайлсхийж, шаардлагатай бол modal stack policy тодорхой байна.
- Assessment create, candidate invite, delete confirmation, result detail зэрэг workflow-д reuse хийх боломжтой байна.

Санал болгож буй бүтэц:

```text
features/ui/modals/
  modal-slice.ts
  modal-provider.tsx
  confirm-modal.tsx
  form-modal.tsx
```

## 7. Notification Requirements

Frontend нь notification/toast удирдах боломжтой байна.

Notification types:

- `success`
- `info`
- `warning`
- `error`

Шаардлага:

- Notification state нь Redux slice эсвэл app-level provider-д байна.
- Auto-dismiss болон manual dismiss дэмжинэ.
- Error message, save success, invite sent, autosave status, session expired зэрэг event-үүд notification ашиглана.
- Notification нь mobile дээр content-ийг халхлахгүй байрлана.
- Screen reader-д announcement хийх боломжтой байна.
- Long-running workflow-д persistent notification эсвэл progress state ашиглах боломжтой байна.

Санал болгож буй бүтэц:

```text
features/ui/notifications/
  notification-slice.ts
  notification-provider.tsx
  toast.tsx
```

## 8. Responsive Design Requirements

Frontend нь гар утас, таблет, PC дээр бүрэн тохирч ажиллана.

Target viewport:

- Mobile: `360px` - `767px`
- Tablet: `768px` - `1023px`
- Desktop: `1024px`+
- Wide desktop: `1440px`+

Шаардлага:

- App shell mobile дээр collapsible navigation эсвэл drawer navigation ашиглана.
- Tablet дээр sidebar compact mode эсвэл adaptive layout ашиглана.
- Desktop дээр persistent sidebar ашиглана.
- Dashboard card/grid нь breakpoint бүр дээр тогтвортой reflow хийнэ.
- Table-heavy screen-үүд mobile дээр card/list эсвэл horizontal scroll strategy-тай байна.
- Modal mobile дээр viewport-д багтаж, form field-үүд дарагдахгүй байна.
- Button/text нь parent container-оос халихгүй.
- Assessment-taking screen mobile дээр уншихад тохиромжтой, answer control-ууд touch-friendly байна.
- Candidate timer/progress UI нь жижиг дэлгэц дээр content-ийг халхлахгүй байна.

Responsive validation:

```text
Mobile: 390x844
Tablet: 768x1024
Desktop: 1366x768
Wide: 1440x900
```

## 9. Application Shell Requirements

`AppShell` нь дараах capability-тай байна:

- Authenticated layout
- Role-aware navigation
- Active route highlight
- Responsive/collapsible sidebar
- Mobile drawer navigation
- Page title/header slot
- User account menu
- Role/workspace indicator
- Language switcher
- Theme switcher
- Notification entry point
- Modal provider mount point

Navigation item бүр icon ашиглах бөгөөд icon import нь `@seek/ui` abstraction-аар дамжина.

## 10. Frontend Scope

Эхний sprint-ийн frontend scope:

- Login page polish
- Authenticated app shell
- Role-aware navigation
- Language switcher
- Theme switcher
- Global modal provider
- Global notification provider
- Dashboard mock experience
- Assessments list/detail/create mock flow
- Candidate invite modal/workflow
- Candidate assessment-taking screen
- Result/report preview
- Organisation/admin overview
- Settings/profile screen
- Empty/loading/error states
- Responsive layout validation

## 11. Recommended Routing

`apps/portal-web` дотор дараах route structure ашиглана:

```text
/dashboard
/assessments
/assessments/new
/assessments/[id]
/assessments/[id]/candidates
/take/[attemptId]
/results
/results/[id]
/organisations
/settings
/profile
/admin
```

Auth route:

```text
/login
```

Locale нь эхний implementation дээр global preference байж болно. Route-level locale (`/mn/dashboard`, `/en/dashboard`) шаардлагатай эсэхийг stakeholder review-ийн дараа шийднэ.

## 12. Assessment Prototype Requirements

Assessment workflow нь frontend prototype-ийн хамгийн чухал хэсэг байна.

Prototype дараах дарааллыг дэмжинэ:

1. Assessment list харах.
2. Шинэ assessment үүсгэх wizard эхлүүлэх.
3. Basic info, competency, section/question тохируулах.
4. Markdown/KaTeX дэмждэг question preview харах.
5. Candidate invite хийх.
6. Candidate progress/detail харах.
7. Candidate assessment-taking view-ээр тест өгөх.
8. Autosave/progress notification харах.
9. Submit хийсний дараа result/report preview харах.

Энэ workflow батлагдсаны дараа `assessment`, `execution`, `evaluation`, `competency`, `reporting` service-үүдийн API contract гаргана.

## 13. Content Rendering Requirements

Assessment болон report content нь Markdown/MDX болон KaTeX дэмжихэд бэлэн байна.

Шаардлага:

- Question stem, instruction, explanation, rubric markdown render хийдэг байна.
- Inline math болон block math KaTeX-ээр render хийх боломжтой байна.
- Raw HTML default-оор хориглогдоно эсвэл sanitize allowlist ашиглана.
- Markdown renderer нь theme-aware typography ашиглана.
- Candidate-taking болон preview screen дээр ижил renderer ашиглана.

## 14. Mock Data and API Adapter Strategy

Backend service-үүд бүрэн бэлэн биш үед frontend дараах бүтэцтэй байна:

```text
features/
  auth/
    mock-users.ts
    session.ts
  dashboard/
    api.ts
    mock-data.ts
    types.ts
  assessments/
    api.ts
    mock-data.ts
    types.ts
    schemas.ts
    components/
  candidate-attempt/
    api.ts
    mock-data.ts
    types.ts
  results/
    api.ts
    mock-data.ts
    types.ts
  ui/
    modals/
    notifications/
```

`api.ts` эхэндээ mock data буцаана. Backend endpoint батлагдсаны дараа ижил interface-ийг real HTTP client руу шилжүүлнэ.

Жишээ:

```ts
export async function listAssessments() {
  return mockAssessments;
}
```

## 15. Design System Requirements

Эхний prototype дээр `@seek/ui` shared package-ийн дараах component foundation-ийг тогтворжуулна:

- Button
- IconButton
- Input
- PasswordInput
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Tabs
- Dialog/Modal
- Table/Data list
- Badge/Chip
- Toast/Alert
- Empty state
- Error state
- Loading skeleton
- Progress bar
- Page header
- Breadcrumb
- Navigation item
- Data card
- Drawer/mobile navigation
- Theme-aware Markdown content

UI нь operational SaaS шинжтэй байна: цэгцтэй, уншихад амар, dashboard/data workflow-д тохирсон, хэт marketing hero маягийн бүтэцгүй.

## 16. Backend Boundary Deferral

Энэ task-ийн хүрээнд backend service implementation хийхгүй. Харин frontend батлагдсаны дараа дараах artifact-ууд гарна:

- API endpoint draft
- Request/response type draft
- Role/permission draft
- Service ownership map
- Event boundary draft
- Backend implementation priority

Backend implementation дараагийн task/sprint-ийн scope болно.

## 17. Files Expected to Modify

Frontend implementation үед дараах хэсгүүд өөрчлөгдөх магадлалтай:

- `apps/portal-web/src/app/**`
- `apps/portal-web/src/components/**`
- `apps/portal-web/src/features/**`
- `apps/portal-web/src/i18n/**`
- `apps/portal-web/src/store/**`
- `packages/ui/src/**`
- `docs/frontend/**`
- `docs/tasks/active-task.md`
- `docs/tasks/roadmap.md`

## 18. Validation Commands

Frontend prototype implementation хийх бүрт дараах safe check-үүдийг ажиллуулна:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Portal-only хурдан шалгалт:

```bash
pnpm --filter @seek/portal-web lint
pnpm --filter @seek/portal-web typecheck
pnpm --filter @seek/portal-web test
pnpm --filter @seek/portal-web build
```

Docker dev орчинтой хамт шалгах үед:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile auth-test up --build -d
```

Browser review:

```text
http://localhost:3001/login
```

Responsive review:

```text
390x844
768x1024
1366x768
1440x900
```

## 19. Acceptance Criteria

Task дууссан гэж үзэх нөхцөл:

- Login хийсний дараа role-д тохирсон default page рүү redirect хийдэг байх.
- Authenticated app shell нь role-aware navigation харуулдаг байх.
- Language switcher ажиллаж, `mn`/`en` UI text солигддог байх.
- Theme switcher ажиллаж, `light`/`dark`/`system` mode хадгалагддаг байх.
- Global modal provider ажиллаж, confirm/form modal demo workflow-той байх.
- Global notification provider ажиллаж, success/info/warning/error notification харуулдаг байх.
- Dashboard mock data-тай ажилладаг байх.
- Assessment list/detail/create mock flow browser дээр дарж үзэх боломжтой байх.
- Candidate-taking screen markdown/math content render хийхэд бэлэн байх.
- Result/report preview flow харагддаг байх.
- Mobile/tablet/desktop/wide viewport дээр layout эвдрэлгүй байх.
- Empty/loading/error states үндсэн workflow-уудад харагддаг байх.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` амжилттай байх.
- Дараагийн backend API contract гаргахад хангалттай data shape тодорхой болсон байх.
- Stakeholder review хийхэд ашиглах богино demo guide бэлэн болсон байх.

## 20. Completion Workflow

Task дуусах үед дараах docs housekeeping заавал хийнэ:

1. `docs/tasks/active-task.md`-ийн тухайн task-ийг `docs/tasks/backup/YYYY-MM-DD-production-ready-frontend-web-prototype.md` рүү архивлах.
2. `docs/tasks/roadmap.md` дээр дууссан ажлын гол шийдвэр, батлагдсан UX direction, i18n/theme/modal/notification decision, дараагийн backend priority-г тэмдэглэх.
3. Шаардлагатай бол `docs/frontend/**` дотор component/layout/routing/i18n/theme guideline-уудыг шинэчлэх.
4. Дараагийн active task-ийг backend API contract эсвэл дараагийн frontend refinement scope-оор шинээр эхлүүлэх.

## 21. Current Next Steps

1. `portal-web`-ийн одоогийн route/layout/component/store бүтцийг уншиж implementation gap гаргах.
2. i18n dictionary/provider foundation хийх.
3. Theme switcher болон theme persistence-г app shell дээр гаргах.
4. Global modal provider, confirm modal demo workflow хийх.
5. Global notification provider, toast demo workflow хийх.
6. Responsive app shell navigation-г mobile/tablet/desktop дээр сайжруулах.
7. Dashboard mock data болон dashboard screen өргөжүүлэх.
8. Assessment module-ийн mock types/data/api/schema layer гаргах.
9. Assessment list/detail/create flow хийх.
10. Candidate-taking болон result preview screen-ийг Markdown/KaTeX ready болгох.
11. Validation command-ууд ажиллуулж үр дүнг тэмдэглэх.

## 22. Page-by-Page Implementation and Approval Plan

Энэ task-ийг бүх хуудсыг зэрэг дуусгах байдлаар биш, **баталгаажуулах gate** бүрээр явуулна. Gate бүр production-ready foundation дээр суурилсан, browser дээр review хийх боломжтой deliverable байна.

### Gate 0: Frontend Foundation Approval

Status: `IN_PROGRESS`

Scope:

- i18n provider, `mn`/`en` dictionary, language switcher.
- Theme switcher, `light`/`dark`/`system` persistence.
- Global modal provider ашигласан confirm modal demo.
- Global notification/toast demo.
- Role-aware app shell responsive navigation-ийн эхний хувилбар.

Review URL:

```text
/login
/dashboard
```

Approval checklist:

- Login болон portal shell дээр хэл солигдоно.
- Theme солиход login/dashboard/sidebar эвдрэхгүй.
- Modal demo keyboard/mouse-оор хаагдана.
- Notification demo mobile/desktop дээр content халхлахгүй.
- Mobile navigation ашиглаж болохуйц байна.

Implementation notes:

- Lightweight i18n provider үүсгэсэн: `apps/portal-web/src/i18n/**`.
- Login page болон portal shell дээр `mn`/`en` language switcher холбосон.
- Existing `@seek/ui` ThemeProvider ашиглан `light`/`dark`/`system` theme switcher portal shell дээр холбосон.
- Existing `@seek/ui` DialogProvider/ToastProvider ашиглан modal болон notification demo action нэмсэн.
- Shared sidebar-ийг desktop/tablet persistent, mobile hidden болгож portal shell дээр mobile drawer нэмсэн.
- Portal-only `lint`, `typecheck`, `test`, `build` амжилттай ажилласан.

Pending approval review:

- Browser дээр `/login` болон `/dashboard` хуудсаар орж хэл/theme/modal/notification/mobile drawer behavior-г баталгаажуулах.
- Login page-ийн visual polish-ийг Gate 1 дээр үргэлжлүүлэн сайжруулах.

### Gate 1: Login and Role Redirect Approval

Status: `IN_PROGRESS`

Scope:

- Login page production polish.
- Mock role users.
- Backend auth user fallback.
- Role бүр default page рүү redirect хийх.
- Login error/loading/empty state.
- Register болон forgot password холбоос.

Review URL:

```text
/login
```

Approval checklist:

- `superadmin@lms.local` -> `/admin`
- `orgadmin@lms.local` -> `/organisations`
- `assessor@lms.local` -> `/assessments`
- `candidate@lms.local` -> `/take/mock-attempt-001`
- `reviewer@lms.local` -> `/results`

Implementation notes:

- Login page дээр role demo account selector panel нэмнэ.
- Role account сонгоход email/password автоматаар бөглөгдөнө.
- Mock хэрэглэгчид backend-д хадгалагдахгүй, frontend mock-data дээрээс session үүсгэнэ.
- `tester@seek.local` account backend auth fallback хэвээр байна.

Pending approval review:

- Browser дээр role бүрийн account card дарж form auto-fill ажиллаж байгаа эсэхийг шалгах.
- Login submit хийсний дараа зөв default page рүү шилжиж байгаа эсэхийг role бүрээр баталгаажуулах.
- Mobile дээр login form болон role selector нэг багана болж эвдрэхгүй харагдаж байгаа эсэхийг шалгах.
- Register холбоос `/register` рүү, forgot password холбоос `/forgot-password` рүү шилжиж байгаа эсэхийг шалгах.
- Register болон forgot password нь одоогоор frontend placeholder бөгөөд backend API дараагийн auth workflow task дээр тодорхойлогдоно.

### Gate 2: Dashboard Approval

Status: `IN_PROGRESS`

Scope:

- Role-aware dashboard cards.
- Recent activity.
- Quick actions.
- Empty/loading/error state examples.
- Mobile/tablet/desktop responsive grid.

Review URL:

```text
/dashboard
```

Approval checklist:

- Role бүр dashboard дээр өөрт хамаарах summary харна.
- Card/grid mobile дээр нэг багана, tablet дээр хоёр багана, desktop дээр олон багана болж reflow хийнэ.
- Quick action-ууд тухайн role-д тохирсон route руу шилжинэ.

Implementation notes:

- `features/dashboard/types.ts`, `mock-data.ts`, `api.ts` foundation нэмнэ.
- Dashboard нь auth session-ийн `role`-оос хамаарч title, metrics, work items, recent activity, quick actions харуулна.
- Mock data нь дараа backend dashboard API-тай солигдох боломжтой feature boundary-д байна.
- Layout нь mobile дээр нэг багана, tablet/desktop дээр responsive grid ашиглана.

Pending approval review:

- Role бүрээр login хийж `/dashboard` руу орон dashboard content тухайн дүртэй нийцэж байгаа эсэхийг шалгах.
- Quick action link-үүд тухайн role-д хэрэгтэй хуудсууд руу шилжиж байгаа эсэхийг шалгах.
- Mobile/tablet/desktop viewport дээр metrics, workflow readiness, activity card-ууд эвдрэхгүй reflow хийж байгаа эсэхийг шалгах.

### Gate 2A: Public Home Page Approval

Status: `IN_PROGRESS`

Scope:

- `/` route-ийг public landing page болгох.
- Public header, hero skeleton үүсгэх.
- Зурагт үзүүлсэнтэй адил “Хэнд зориулсан вэ?” section оруулах.
- 5 audience card: Төрийн албан хаагч, Сурагчид, Багш нар, Удирдлага, Бусад бүлэг.
- Icon circle, title, description, spacing, card radius, responsive grid-ийг зурагтай ойролцоо болгох.
- Зураг дээрх “Платформын боломжууд”, “Ажиллах зарчим”, “Түгээмэл үнэлгээнүүд”, “Байгууллагын захиалга”, stats хэсгүүдийг public home page дээр оруулах.

Review URL:

```text
/
```

Approval checklist:

- “Хэнд зориулсан вэ?” section зураг дээрх бүтэцтэй адил 5 card-аар харагдана.
- Card бүр icon circle, title, short description-тэй байна.
- Desktop дээр 5 card нэг мөрөнд, tablet дээр 2-3 багана, mobile дээр нэг багана болж reflow хийнэ.
- Header-ийн login/register холбоос ажиллана.
- Public home page `/dashboard` руу автоматаар redirect хийхгүй.
- “Ажиллах зарчим” 5 алхамтай horizontal stepper хэлбэрээр desktop дээр, mobile дээр stacked байдлаар харагдана.
- “Түгээмэл үнэлгээнүүд” card бүр tag, title, question count, duration, price/detail action-тэй байна.
- “Байгууллагын захиалга” CTA card register/order route руу шилжих action-тэй байна.

Pending approval review:

- Зурагтай харьцуулахад spacing, card border, icon circle, title/description-ийн hierarchy тохиромжтой эсэхийг шалгах.
- Лого/brand wording дараагийн polish-д ямар байхыг шийдэх.
- Платформын боломжууд, ажиллах зарчим, түгээмэл үнэлгээний copy болон дараалал зурагтай нийцэж байгаа эсэхийг шалгах.

### Gate 3: Organisation/Admin Approval

Status: `IN_PROGRESS`

Scope:

- Super Admin platform overview.
- Organisation Admin workspace overview.
- User/team placeholder.
- Billing/settings placeholder.
- Modal confirm болон notification workflow reuse.
- Нүүр хуудасны design language-тай нийцсэн light SaaS style: white cards, subtle border/shadow, primary/cyan accent, compact metrics.

Review URL:

```text
/admin
/organisations
```

Approval checklist:

- Super Admin болон Organisation Admin-ийн boundary ойлгомжтой байна.
- Admin action-ууд destructive confirmation ашиглана.
- Organisation overview mobile дээр уншихад эвтэйхэн байна.
- `/admin` болон `/organisations` нь public home/dashboard-оос visual style тасарсан мэт харагдахгүй байна.

Pending approval review:

- Super Admin дээр platform/global scope, Organisation Admin дээр tenant/workspace scope ялгаатай харагдаж байгаа эсэх.
- Action card, metric card, status list-үүд production SaaS dashboard style-тай нийцэж байгаа эсэх.
- Modal/notification demo action workflow ойлгомжтой эсэх.

### Gate 4: Assessment Builder Approval

Status: `IN_PROGRESS`

Scope:

- Assessment list.
- Assessment detail.
- Create assessment wizard.
- Candidate invite modal.
- Markdown/KaTeX question preview.
- Form validation foundation.

Review URL:

```text
/assessments
/assessments/new
/assessments/[id]
```

Approval checklist:

- Assessor assessment үүсгэх flow-г ойлгомжтой дарж үзнэ.
- Markdown/math preview candidate-taking renderer-тэй ижил харагдана.
- Invite action notification харуулна.

Implementation notes:

- `features/assessments/types.ts`, `mock-data.ts`, `api.ts` foundation нэмнэ.
- `/assessments` list page нь metric cards, assessment cards, progress, detail action-тай байна.
- `/assessments/new` create wizard эхний алхам, lightweight validation, draft save notification-той байна.
- `/assessments/[id]` detail page нь question preview, competencies, candidate invite modal/notification-той байна.
- Markdown/KaTeX renderer одоогоор preview placeholder; бодит renderer dependency дараагийн content rendering refinement дээр батлагдана.

Pending approval review:

- List -> Detail -> Back урсгал ойлгомжтой эсэх.
- List -> New wizard -> Draft save notification ажиллаж байгаа эсэх.
- Detail дээр invite demo modal/notification ажиллаж байгаа эсэх.
- Assessment хуудсууд нүүр хуудас/dashboard/admin style-тай нийцэж байгаа эсэх.

### Gate 5: Candidate Taking Approval

Status: `IN_PROGRESS`

Scope:

- Screenshot reference-тэй нийцсэн candidate assessment-taking screen.
- Top status card: assessment title, current question counter, connection/autosave status, circular timer.
- Main workspace: question header, question type/points, prompt/instruction, answer controls.
- Question types: single choice, multiple choice, matching, ordering, fill in the blank, matrix.
- Additional question types: тоон хариулт, Likert шкал, SJT, кейсэд суурилсан багц, бичгийн шалгалт.
- Media-supported questions: зураг, аудио, видео, файл attachment preview дэмжинэ.
- Math content rendering: inline LaTeX-style fraction/superscript formatting, KaTeX-compatible content syntax.
- Q3 matching drag-and-drop: сонгох утгуудыг drop zone руу чирч харгалзуулна.
- Q4 ordering drag-and-drop: item-уудыг чирж дараалалд оруулна, keyboard fallback up/down control-той байна.
- Right navigator: answered count, grid/list view toggle, question number grid, question summary list, status legend, finish action.
- Footer controls: clear answer, mark for review, previous, save & next/save & finish.
- Submit confirmation modal: answered/unanswered summary, unanswered question numbers, back/submit actions.
- Mobile/tablet/desktop responsive candidate focus layout.

Review URL:

```text
/take/mock-attempt-001
```

Approval checklist:

- Top timer/status card screenshot-тэй адил hierarchy-тай харагдана.
- Асуултын card болон right navigator desktop дээр 2 баганаар, mobile/tablet дээр stacked байдлаар эвдрэлгүй харагдана.
- Single choice, multiple choice, matching, ordering, fill blank, matrix UI төрлүүд review хийх боломжтой байна.
- Numeric, Likert, SJT, case bundle, essay төрлүүд review хийх боломжтой байна.
- Зураг/audio/video/file attachment-тай даалгаврууд question body дээр харагдана.
- Математик томъёо plain text биш, fraction/superscript форматтай харагдана.
- Q3 дээр баруун талын сонгох утгыг зүүн талын drop zone руу чирж байрлуулж болно.
- Q4 дээр item-уудыг drag-and-drop болон up/down button-аар эрэмбэлж болно.
- Question number grid answered/current/marked/unvisited төлөвүүдийг ялгаж харуулна.
- Navigator нь compact grid болон дэлгэрэнгүй list гэсэн 2 харагдацтай байна.
- “Сэжүүр авах” товч candidate-taking footer дээр харагдахгүй байна.
- Submit өмнө screenshot-тэй адил answered/unanswered summary modal гарна.
- Gate 6 руу шилжихгүй, Gate 5 approval/refinement дээр зогсоно.

Implementation notes:

- `features/candidate-attempt/types.ts`, `mock-data.ts`, `api.ts` foundation нэмнэ.
- `/take/mock-attempt-001` нь screenshot reference-тэй ойролцоо exam workspace layout-тай байна.
- Mock attempt 7 асуулттай болж, candidate-taking UI олон question-type харуулах чадвартай болсон.
- Mock attempt 12 асуулттай болж, assessment engine-д хэрэгтэй өргөн question taxonomy-г frontend prototype дээр харуулж эхэлсэн.
- Media attachment model нь `image`, `audio`, `video`, `file` төрлүүдтэй; одоогоор preview/render layer бөгөөд upload/storage/backend delivery дараагийн backend scope-д орно.
- Mock content нь `$...$`, `\\frac{}{}`, `^` зэрэг KaTeX-compatible syntax ашиглаж эхэлсэн; одоогоор network dependency нэмэлгүй inline renderer-ээр prototype түвшинд форматлаж байна.
- Q3/Q4 interaction нь native HTML5 drag/drop дээр суурилсан, mobile болон keyboard fallback-д click/up/down action-тай байна.
- Хариулт өөрчлөхөд local autosave/connection status update хийнэ; explicit save/hint/submit дээр notification гарна.
- Submit action нь custom summary modal ашиглаж, unanswered question numbers харуулна.

Pending approval review:

- Screenshot reference-тэй харьцуулахад spacing, card radius, timer, right navigator, bottom action bar нийцэж байгаа эсэх.
- Matching/ordering drag/drop interaction-ийн мэдрэмж desktop/mobile дээр хангалттай эсэхийг шалгах.
- Production content rendering үед `katex` package dependency нэмэх эсэхийг батлах.
- Fill blank болон matrix control-ууд mobile дээр уншихад тохиромжтой эсэх.
- Numeric/Likert/SJT/case bundle/essay төрлүүдийн UX production хэрэгцээнд хангалттай эсэх.
- Media attachment preview layout нь desktop/mobile дээр даалгаврын content-ийг халхлахгүй байгаа эсэх.
- Submit modal wording, өнгө, button дарааллыг баталгаажуулах.

### Gate 6: Results and Reports Approval

Status: `IN_PROGRESS`

Scope:

- Screenshot reference-тэй нийцсэн `cvbcv Results` tabbed report view.
- Analysis tab: status/score/accuracy/speed metrics, total questions donut, time donut, scored marks panel.
- Skill graph: radar-style competency visualization.
- AI алдааны дүн шинжилгээ card.
- Solutions tab: question navigator, status legend, question review, correct/selected answer styling, solution explanation.
- Top Scorers tab: personal best/average/worst comparison, attempt count, leaderboard table.
- Download Score Report action placeholder.
- Reviewer/HR болон Candidate өөрийн result preview хийхэд тохирох responsive layout.

Review URL:

```text
/results
/results/[id]
```

Approval checklist:

- Analysis/Solutions/Top Scorers tab switching browser дээр ажиллана.
- Analysis metrics зураг дээрх hierarchy-тэй ойролцоо, mobile/tablet/desktop дээр reflow хийнэ.
- Solutions tab дээр question navigation болон solution explanation ойлгомжтой байна.
- Top Scorers tab дээр performance comparison болон leaderboard production dashboard style-тай байна.
- Download Score Report button харагдах боловч одоогоор backend/export API-гүй placeholder байна.
- Report preview print/export-ready layout-ийн эхлэлтэй байна.

### Gate 7: Settings/Profile Approval

Status: `APPROVED`

Scope:

- `/profile` дээр 6 tab-тай profile workspace: Хувийн мэдээлэл, Албан тушаалын түүх, Харьяалал, Баталгаажуулалт, Бичиг баримт, Аюулгүй байдал.
- Verification request card, verification level/progress, next-step checklist.
- Employment history table, affiliation table, document table.
- Security tab: password/MFA placeholders, active sessions, logout controls.
- `/settings` дээр preference-only boundary: language, theme, notification preferences, data export/session summary.
- Modal/notification reuse: verification request, settings save feedback.

Review URL:

```text
/profile
/settings
```

Approval checklist:

- `/profile` дээр 6 tab browser дээр солигдож ажиллана.
- Хувийн мэдээлэл tab зурагны санаатай төстэй profile identity + verification summary layout-тай байна.
- Албан тушаал, харьяалал, бичиг баримт нь table-heavy боловч mobile дээр horizontal scroll strategy-тай байна.
- Баталгаажуулалт tab дээр request action modal/notification ашиглана.
- Аюулгүй байдал tab дээр MFA/session/security checklist ойлгомжтой байна.
- Хэрэглэгч хэл/theme preference-ээ өөрчилж чадна.
- Settings mobile дээр form layout эвдрэхгүй.
- Preference update notification гарна.

### Gate 8: Prototype Completion Approval

Scope:

- Бүх gate-ийн polish.
- Candidate assessment catalog refinement: `/catalog` route, search/filter/card-list view, candidate login redirect, public home catalog links.
- Candidate portal menu refinement: `/join-assessment`, `/my-assessments`, `/certificates`, `/payments`, `/groups`, `/notifications`, `/support` хуудсууд.
- Paid assessment purchase refinement: `/catalog` cart, checkout confirmation, paid/free action split.
- Candidate dashboard and wallet refinement: candidate-д `/dashboard` буцааж нээсэн, `/wallet` route нэмсэн.
- Candidate shell refinement: layout header дээр сагсны badge/нийт дүн, profile dropdown, profile/settings/wallet links, logout action нэмсэн.
- Responsive screenshots/review notes.
- Demo guide.
- API contract draft-д хэрэгтэй frontend data shape summary.
- Roadmap update.
- Active task archive.

Approval checklist:

- Candidate login хийсний дараа шууд `/catalog` руу очно.
- `/catalog` дээр search, filter row, category chip, card/list view toggle ажиллана.
- Candidate sidebar нь үнэлүүлэгчийн self-service portal цэсүүдтэй байна.
- Зорилтот үнэлгээнд кодоор нэгдэх, миний үнэлгээ, сертификат, төлбөр, бүлэг, мэдэгдэл, тусламжийн хуудсууд review хийх боломжтой байна.
- `/catalog` дээр төлбөртэй үнэлгээг сагсанд нэмж checkout demo хийх боломжтой байна.
- Үнэгүй үнэлгээ шууд эхлүүлэх, төлбөртэй үнэлгээ худалдан авах алхмаар явах ялгаа харагдана.
- Candidate role дээр `/dashboard` болон `/wallet` sidebar-аас нээгдэнэ.
- Candidate layout header дээр сагс харагдаж, `/catalog` дээр нэмсэн item count/total синк хийнэ.
- Header profile дээр дарахад хэрэглэгчийн цэс нээгдэж, системээс гарах action ажиллана.
- Public home-ийн “Үнэлгээний сан”, hero primary, “Бүгдийг харах”, assessment detail link-үүд `/catalog` руу чиглэнэ.
- Portal-only validation ногоон байна.
- Full repo validation боломжит хэмжээнд ногоон байна.
- Stakeholder demo хийхэд ашиглах богино guide бэлэн байна.
- Дараагийн backend API contract task үүсгэхэд хангалттай шийдвэрүүд roadmap дээр тэмдэглэгдсэн байна.
