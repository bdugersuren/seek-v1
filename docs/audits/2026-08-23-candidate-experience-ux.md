# Candidate experience — шаардлага ба UX/UI шинжилгээ

**Snapshot:** 2026-08-23

## Дүгнэлт

Candidate-ийн замналын зөв суурь бүтэц аль хэдийн бий: `portal-web` нь account, profile, каталог, enrollment болон self-service-д; `assessment-web` нь waiting room, timer, autosave, reconnect, submit зэрэг өндөр ачааллын шалгалтын runtime-д зориулагдсан. Энэ заагийг хадгалах нь хамгийн чухал архитектурын шийдвэр юм.

Production candidate experience нь “бүх menu page-тэй байх” гэсэн ойлголтоос илүү дараах 5 тасралтгүй мөчийг алдаагүй гүйцэтгэх ёстой: **нэвтрэх → эрх/профайлаа бэлэн болгох → зөв үнэлгээнд нэгдэх → баталгаатайгаар шалгалт өгөх → ойлгомжтой дараагийн алхам/үр дүн харах**.

Одоогийн кодын үнэлгээгээр login, role guard, onboarding/profile, catalog gate, waiting room болон runtime-ийн суурь нь бодит API-тэй эсвэл API contract-д бэлтгэгдсэн байна. Харин result, payment, wallet, certificate, group, notification, support-ийн ихэнх нь mock/placeholder тул production амлалт өгөхөөс өмнө route бүрийн статусыг бүтээгдэхүүний бодлогод нийцүүлэн шийдэх шаардлагатай.

## Candidate journey ба хуудасны бүрэн зураг

```text
Public auth
  Login / Register / Verify email / Password recovery
      ↓ candidate role
Portal onboarding ── incomplete ──> Profile completion
      ↓ ready
Catalog ── code / enrollment / payment / schedule gate ──> Waiting room
      ↓                                                      ↓
My assessments <──────── Submitted receipt <── Assessment runtime
      ↓                         ↓
Results / certificates / support / notifications
```

| Journey state | Route / application | MVP-д заавал байх UX | Одоогийн хэрэгжилтийн үнэлгээ |
| --- | --- | --- | --- |
| Authentication | Portal: `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password` | Login state, password recovery, email verification resend, locale, explicit errors | Суурь UI болон resend flow бий; mock auth нь production path-тай андуурагдахгүй байх ёстой |
| Authorization | Portal candidate layout + `RoleGuard` | Candidate бус role-г зөв home руу redirect, unauthorized/loading state | Хэрэгжсэн; client guard-оос гадна сервер/API authorization заавал үлдэнэ |
| First-use onboarding | `/onboarding` | Required field progress, save/retry, "why needed" тайлбар, skip policy | Profile API-д тулгуурласан сайн суурь; completion-ын тодорхой хураангуй нэмэх хэрэгтэй |
| Personal profile | `/profile` | Personal data, phone/OTP, identity/document status, edit/audit, privacy | API-integrated, loading/error/upload states бий; sensitive identity UX-г илүү хүчтэй тайлбарлах шаардлагатай |
| Discover / choose | `/catalog` | Search/filter, eligibility, price, schedule, workload, access CTA | Catalog API болон gate ашиглаж байна; card/detail мэдээлэл гол урсгалд хангалттай |
| Join by code | Portal `/join-assessment`, runtime `/join/[code]` | Code input, validation, expiry/error/retry, identity binding | Entry UI бий; canonical нэг flow болгож, хоёр app-ын давхардлыг арилгах шаардлагатай |
| My commitments | `/my-assessments` | Upcoming, waiting, active, submitted, results tabs; one primary next action | Одоогоор mock data болон `mock-attempt-001` link хэрэглэнэ — P0 product gap |
| Payment/enrollment | `/payments`, `/wallet` | Price, order state, invoice/receipt, refund/support, retry-safe checkout | Mock/placeholder — Commerce contract байхгүй үед live CTA бүү харуул |
| Pre-exam | Assessment web `/waiting/[attemptId]` | Server time, schedule, instructions, device/readiness, consent, accessible start | Strongest current candidate page; API-authoritative readiness-г баталгаажуулах шаардлагатай |
| Active exam | Assessment web `/take/[attemptId]` | Server timer, question navigation, save state, offline/recovery, policy warnings, submit confirmation | Correct interaction model; production data/API replacement and accessibility validation required |
| Exceptional exam states | `/connection-lost`, `/locked`, `/submitted/[attemptId]` | Clear cause, what is retained, what happens to time, recovery/support path, receipt | UI routes exist, but several use `mock-attempt-001`; real attempt-specific states needed |
| Results | Candidate result/report experience | Availability date, score/decision, feedback policy, download/accessibility, appeal/support | Results API returns mock data; no candidate-facing route in the candidate route tree — P0/P1 gap |
| Trust/self-service | `/notifications`, `/certificates`, `/support`, `/settings`, `/groups` | Meaningful data, preferences, contact/reply trail, certificate verification | Mostly mock/static; ship only after backend contract or mark unavailable intentionally |

## Хуудас бүрийн шаардлага ба санал болгож буй дизайн

### 1. Auth ба account activation

**Зорилго:** хэрэглэгчийг хурдан, аюулгүй, ойлгомжтой нэвтрүүлж, баталгаажуулаагүй account-ыг dead-end-д оруулахгүй байх.

- Login card: email, password, "Нууц үг мартсан", registration CTA, language selector, error-ийн шалтгаан болон дахин оролдох үйлдэл.
- Email verification: email address-ийг masked хэлбэрээр, resend cooldown, "өөр email ашиглах" болон support escape hatch; verification link expire үед тодорхой дахин илгээх урсгал.
- New candidate: registration дуусмагц `/onboarding` руу; verified боловч profile incomplete бол catalog/view эрхийг нээлттэй үлдээн, start action-ыг gate-ээр хязгаарлах.
- Design: нэг баганат, төвлөрсөн 420–480px card; mobile дээр full-width; form error нь field-ийн доор, toast дангаараа биш байх.

### 2. Onboarding ба profile

**Зорилго:** зөвхөн үнэлгээнд хэрэгтэй хамгийн бага өгөгдлийг авах бөгөөд completion-ын шалтгааныг ойлгуулах.

- Stepper: `1. Хувийн мэдээлэл → 2. Холбоо барих → 3. Шаардлагатай баримт` гэсэн 3-аас ихгүй алхам. Completion API-ийн `missingFields`-ийг яг харуулна.
- Field policy: required/optional-г урьдчилан ялгана; phone OTP болон identity document-г assessment-specific gate шаардсан үед л асууна.
- Profile home: completion percentage биш, **“Үнэлгээнд ороход бэлэн / дутуу 2 зүйл”** гэсэн action-oriented state; document нь `Draft / Submitted / Verified / Rejected` badge, rejection reason, resubmit CTA-тай байна.
- Privacy: file type/size, хадгалах зорилго, retention/contact, download/delete эрхийг file upload-ын өмнө тайлбарлана.
- Design: desktop дээр "Profile status" summary sidebar + editable content; mobile дээр status card эхэнд, accordion section; destructive document deletion-д confirm dialog.

### 3. Catalog, eligibility ба enrollment

**Зорилго:** candidate тухайн үнэлгээнд орох эсэхээ эхлэхээс өмнө мэдэх.

- Catalog card дээр: title, provider, level, duration, question count, schedule/timezone, price/free, language, accessibility need, attempt limit, result-release policy.
- Filter: keyword, provider/category, date, price, language, status (`Нээлттэй`, `Удахгүй`, `Хүлээлгийн өрөө нээлттэй`, `Дууссан`). Empty-state нь filter clear болон support CTA-тай.
- Detail drawer/page: eligibility, required preparation/device, privacy/proctoring policy, cancellation/refund, schedule timeline, clear single CTA.
- Gate UI: backend-ийн `blockedReason`-г хэрэглэгчийн хэлээр action болгон буулгана: `EMAIL_NOT_VERIFIED → Email баталгаажуулах`, `PROFILE_INCOMPLETE → Профайлаа бөглөх`, `PAYMENT_REQUIRED → Төлбөр рүү`, `NOT_ENROLLED → Код/урилга`, `ASSESSMENT_NOT_OPEN → Хуваарь харах`, `ALREADY_ATTEMPTED → Үр дүн харах`.
- Design: card list болон compact table хоёрыг desktop/mobile хэрэгцээгээр сольж болно; CTA нь status-аас хамааран өөрчлөгдөх ч card бүрт ганц primary action байна.

### 4. My assessments ба join code

**Зорилго:** candidate-ийн өдөр тутмын "одоо юу хийх вэ?" төв дэлгэц байх.

- Default route-ийг `/catalog` биш `/my-assessments` эсвэл candidate dashboard болгох эсэхийг бүтээгдэхүүн шийднэ. Хэрэв олон нийтэд нээлттэй каталогоос илүү assigned exam хэрэглээтэй бол **Миний үнэлгээ** нь default байхыг санал болгоно.
- Four state tabs: `Удахгүй`, `Хүлээлгийн өрөө`, `Явагдаж буй`, `Дууссан`; хамгийн ойрын deadline/CTA-г top priority card дээр харуулна.
- Join code: нэг canonical route; code form дээр формат, paste, loading, invalid/expired/already-used, organization mismatch, schedule-not-open-ийн state; амжилттай бол enrollment confirmation → waiting room.
- Mock attempt id болон hard-coded deep link-ийг production navigation-аас бүрэн арилгана.

### 5. Waiting room

**Зорилго:** candidate-ийг сандралгүйгээр техникийн болон бодлогын хувьд бэлэн болгох.

- Одоогийн серверийн schedule, countdown, instruction acceptance, readiness row-ууд нь зөв чиглэл.
- Readiness checklist: internet latency/connection, browser support, viewport/fullscreen, audio/camera/mic **зөвхөн шаардлагатай assessment-д**, permissions, clock/server sync. Check бүр `pass / warning / fail` + шийдэх заавартай.
- Start button нь server-authoritative `canStart` ба instruction consent-оор удирдагдана. Client countdown нь зөвхөн UI; server time label-г байнга харуулна.
- Design: distraction-free light shell; left content (instruction), right sticky countdown/status; mobile-д countdown top, CTA bottom sticky. Warning нь шар, hard block нь улаан боловч зөвхөн өнгөөр бүү ялга.

### 6. Active assessment runtime

**Зорилго:** хариулт алдахгүй, үлдсэн цаг/хадгалалт тодорхой, анхаарал сарниулахгүй байх.

- Runtime зөвхөн `assessment-web` дээр үлдэнэ; portal-ийн `/take/[attemptId]` prototype fallback-г production route болгон ашиглахгүй.
- Fixed header: assessment title, server timer, connection state, save state, answered count; status нь `Saved`, `Saving`, `Offline—local хадгалсан`, `Retrying`, `Error` гэсэн тексттэй байна.
- Main layout: question content + response form; desktop дээр question navigator side panel, mobile дээр bottom sheet/drawer. Current question, answered/unanswered, flagged, disabled navigation policy-г icon + text-ээр ялгана.
- Answer ergonomics: autosave debounce, keyboard support, focus management, autosave retry, confirmation before irreversible submission; no accidental page navigation.
- Proctoring: visibility/fullscreen event-ийг тайван, тодорхой warning болгон харуул; browser-only хяналтыг "100% хамгаалалт" гэж бүү амла. Camera/mic consent, data handling, appeal policy-г exam эхлэхээс өмнө тайлбарлана.
- Accessibility: timer/update-д `aria-live`-ийн давтамжийг хязгаарлах, keyboard-only completion, visible focus, scalable text, contrast, motion-reduced behavior, question media-ийн transcript/caption/alt text.

### 7. Interrupted, locked, submitted

- **Connection lost:** "Хариулт local buffer-д хадгалагдаж байна/хадгалагдаагүй" гэсэн бодит статус, reconnect automatic retry, server time үргэлжилж буй тайлбар, emergency support ref. Generic `mock-attempt-001` link ашиглахгүй.
- **Locked:** шалтгаан, policy reference, review pending эсэх, appeal/support next step, attempt id, timestamp; candidate буруутгасан өнгө аясаас зайлсхий.
- **Submitted receipt:** assessment title, submitted-at server timestamp, receipt id, answers/score/result visibility policy, "дараа нь юу болох вэ" timeline. Receipt-ийг candidate portal-ийн my-assessments руу буцаана.

### 8. Results, certificates, payments, support, notifications

- **Results (P0/P1):** release policy-г дагана: unavailable/pending/manual review/released. Released үед score, pass/fail, percentile (зөвшөөрвөл), per-section feedback, downloadable report, appeal deadline. Solutions зөвхөн policy зөвшөөрвөл.
- **Certificates (P1):** certificate issue status, credential ID, verification URL/QR, download, revocation/expiry indicator. Mock list-ийг live мэт бүү үзүүл.
- **Payments/wallet (P1):** order detail, amount/currency, payment provider redirect, `pending/succeeded/failed/refunded`, invoice, retry-safe callback, support/dispute. Wallet зөвхөн бодит balance ledger-тэй бол ашиглана.
- **Notifications (P1):** unread/read, category, deep link, preference, delivery status. Header дээрх hard-coded badge-г backend unread count-оор солих.
- **Support (P1):** FAQ search + ticket create + category + attachment + status + conversation + incident reference. Urgent exam support-ыг runtime-аас access хийх.

## Global information architecture ба navigation

Candidate header одоогоор Catalog, My assessments, Payments, Support болон profile dropdown-той. Production-д дараах энгийн бүтэц санал болгоно:

| Primary navigation | Secondary/profile | Conditional |
| --- | --- | --- |
| Миний үнэлгээ, Каталог | Профайл ба verification, Тохиргоо, Гарах | Notifications, Support, Payments, Certificates |

- `Groups`, `Wallet`, `Certificates`, `Payments` нь live data/clear product policy үүсэхээс өмнө primary navigation-д орохгүй.
- Header search нь ажиллах бодит search байхгүй бол бүү үзүүл; placeholder search нь candidate-ийн итгэлийг бууруулна.
- Notification icon нь Settings icon биш Bell icon ашиглаж, real unread count-г л харуулна.
- Active exam үед portal global navigation-г үзүүлэхгүй; runtime-д зөвхөн session-аас аюулгүй гарах/тусламж/technical status байхад хангалттай.

## Нэгдсэн дизайн хэл ба responsive дүрэм

`@seek/ui` token, `PageContainer`, semantic color, existing mobile/tablet/desktop breakpoints-ийг ашиглана.

- **Visual tone:** тайван, итгэл төрүүлэх, assessment-first. Primary blue нь ганц гол CTA-д; warning/danger нь зөвхөн бодит эрсдэлд; card overload-оос зайлсхий.
- **Layout:** portal-д max-width content container, 12-column desktop grid, mobile single-column. Runtime-д content line-length 60–80 character, timer/submit action always discoverable.
- **Typography:** Mongolian урт өгүүлбэрт 16px minimum body, 44px minimum interactive target, date/time-г нэг формат + timezone-тай. Technical хэллэгийн хажууд plain-language тайлбар байна.
- **State design:** page бүр loading skeleton, empty state, permission/eligibility state, inline field validation, retryable network error, success confirmation, optimistic action rollback policy-той.
- **Accessibility acceptance:** WCAG 2.2 AA contrast, keyboard navigation, focus trap бүхий dialogs, labels/error associations, semantic headings/landmarks, no color-only status, 200% zoom болон 320px width test.

## Илэрсэн product/UX эрсдэл

| Priority | Gap | User impact | Шийдэл |
| --- | --- | --- | --- |
| P0 | Candidate result route/API production-ready биш | Candidate submit хийсний дараа үр дүн, дараагийн алхмаа найдвартай харахгүй | Result release contract, portal result route, receipt-to-result journey-г хэрэгжүүлэх |
| P0 | My assessments болон portal prototype take mock data ашигладаг | Буруу attempt руу очих, бодит түүх/статус харагдахгүй | Attempt list/detail API ба canonical runtime URL ашиглах; prototype route-г internal/demo болгох |
| P0 | Payment/enrollment UX нь placeholder | Paid assessment candidate dead-end болох эрсдэлтэй | Commerce contract гартал paid CTA-г waitlist/contact/support state болгон ил тод харуулах |
| P0 | Exceptional runtime routes attempt-specific биш | Network/lock үед буруу сэргээх холбоос эсвэл ойлгомжгүй support | Attempt id, server status, recovery API, support reference-ийг state бүрт дамжуулах |
| P1 | Header-ын search, notification badge, зарим self-service page mock/static | Функц ажиллах мэт харагдаж итгэл бууруулна | Backend contract хийж live болгох эсвэл navigation/CTA-гаас түр нуух |
| P1 | Join code хоёр апп дээр тусдаа эхлэлтэй | Flow, validation, ownership давхардана | Нэг canonical join/enrollment owner ба redirect contract тогтоох |
| P1 | Accessibility acceptance test тодорхой бус | Candidate completion, ялангуяа keyboard/screen reader, саадтай | Shared component audit + route-level e2e/a11y tests нэмэх |
| P2 | Dashboard/default home-ийн intent тодорхой бус | Candidate хамгийн чухал дараагийн үйлдлээ олоход удаан | Assigned-first эсвэл catalog-first product decision авч, home-г үүнд тааруулах |

## Хэрэгжүүлэх дараалал ба acceptance criteria

### P0 — candidate core loop

1. Real attempt list/status + attempt detail, canonical join/start redirect, runtime receipt-to-portal return.
2. Result availability/release UI, submitted receipt, pending/manual review/appeal states.
3. Attempt-specific connection lost, lock, recovery, support states.
4. Payment-required flow-г бодит order contract-той холбох; бэлэн биш бол ил тод unavailable state болгох.

**Done:** verified, completed-profile candidate нь өөрийн scheduled assessment-ийг олж, eligibility-г ойлгож, waiting room-оор дамжин runtime-д орж, interruption-аас сэргээж, receipt/result policy-г харах боломжтой; ямар ч дэлгэц `mock-attempt-*`-д найдахгүй.

### P1 — trust ба self-service

1. Document/identity status болон privacy copy-г harden хийх.
2. Notification, support ticket, certificate, payment history-ийн live contract/UI.
3. Accessibility, mobile, localization, low-bandwidth/error-state QA.

**Done:** бүх харагдаж буй menu/CTA бодит data-тэй эсвэл availability state-тэй; candidate support авахаас эхлээд credential/download хүртэл self-service хийх боломжтой.

### P2 — optimization

1. Personalized catalog/recommendation, saved searches, richer dashboard.
2. Analytics: onboarding completion, gate block reason, waiting-room readiness failure, runtime save/reconnect, submit/result conversion.
3. Usability testing: 5–8 candidate-аар mobile-first task test хийж copy, schedule/timezone, CTA-г сайжруулах.

## QA scenario checklist

- Candidate, non-candidate, unauthenticated role states болон email-not-verified redirect.
- Incomplete profile → save/retry → catalog gate → allowed assessment.
- Free, invite-code, paid, closed, not-yet-open, already-attempted access states.
- Timezone/schedule window, countdown, consent, each readiness failure.
- Autosave, offline buffer, reconnect, duplicate submit, time expiry, browser violation/lock, refresh/recovery.
- Result hidden/pending/released/manual-review, certificate available/unavailable, payment pending/failed/refunded.
- Keyboard-only, screen reader, 320px, 200% zoom, slow 3G, locale/date formatting.
