# CANDIDATE — Backend, frontend, UI/UX аудит

Огноо: 2026-09-12. Тэргүүлэх хэрэглээ: **байгууллагаас оноосон шалгалт** (хэрэглэгчийн сонголт).

## 1. Гол дүгнэлт, хамрах хүрээ

CANDIDATE-ийн production замнал одоогоор эхнээсээ төгсгөл хүртэл ажиллахад бэлэн биш. Нэвтрэлт, профайл, каталогийн өгөгдөл унших, attempt эзэмшлийн хамгаалалт, runtime-ийн зарим суурь бий. Харин **оноолт → бодит attempt → найдвартай хариулт → бодит receipt → нийтэлсэн үр дүн** гэсэн холбоосууд дутуу буюу зөрүүтэй.

Харагдах хуудас бүрэн байгаа нь бизнес үйлдэл бүрэн ажиллаж байна гэсэн үг биш. Demo дүн, receipt, миний үнэлгээ, нэмэлт цэсүүд production bundle-д харагдаж байна. Энэ аудитын хүрээнд бүтээгдэхүүний код, тохиргоо, production өгөгдөл өөрчлөөгүй; зөвхөн энэ тайлан нэмсэн.

Шалгалтын арга:

- Ажлын эх код: auth, profile, assessment/catalog/schedules/context access, execution/state store/signature/event publisher, reporting, gateway; portal candidate routes болон assessment runtime.
- Production: нууц бус container тохиргоо, DB-ийн зөвхөн нийт тоо; жинхэнэ HTTPS/NPM рүү LAN resolver ашигласан public browser шалгалт.
- Тусгаарласан шалгалт: execution-ийн 21 unit test; санах ойн store дээр хугацаа/хувилбар/late submit-ийн 3 reproduction.
- Өмнөх `2026-08-23-candidate-experience-ux.md` аудитыг одоогийн кодтой тулгасан; өмнөх дүгнэлтийг дангаар нотолгоо болгоогүй.

Хязгаар: жинхэнэ CANDIDATE account-аар production бүртгэл, OTP, бодит шалгалт, manual grading, result release хийгээгүй. Production-д ийм урсгалын schedule/assignment/attempt байхгүй. Private хуудсуудын UX нь кодын аудит; public runtime хуудасны UX нь browser-оор батлагдсан. Бүх private дэлгэцийн visual regression, screen reader, load test, хэрэглэгчтэй usability test хийгдсэн гэж үзэхгүй.

## 2. Production-ийн шалгасан төлөв

| Хэсэг | Батлагдсан төлөв |
|---|---|
| Execution image | `seek-backend:production` |
| Assessment frontend image | `seek-assessment-web:production` |
| Gateway image | `seek-backend:context-access-20260911` |
| Mock environment | Assessment frontend `NEXT_PUBLIC_MOCK_MODE=false`; шууд mock import-уудыг энэ flag хаадаггүй |
| Signature | Execution `ENABLE_SIGNATURE_VERIFICATION=false` |
| Persistence / queue | `USE_REDIS=true`, `USE_RABBITMQ=true`; execution state store нь Prisma |
| Disabled gateway services | `commerce,notification,reporting,ai,learning,verification,competency,platform` |
| Assessment DB | `quiz_schedule=0`, `quiz_user_assignment=0` |
| Execution DB | `quiz_attempt=0`, `question_response=0`, `attempt_submission=0` |

Эдгээр нь шалгах үеийн тоо. Бодит хариулт алдагдсан, хугацаа зөрчсөн үйл явдал болсон гэсэн нотолгоо байхгүй. Доорх runtime асуудлуудын ихэнх нь бодит шалгалт нээхэд илрэх **урьдчилан батлагдсан эрсдэл**.

## 3. Хэрэглэгчийн замналын зураг

| Алхам | Одоогийн байдал | Шаардлагатай үр дүн |
|---|---|---|
| Бүртгэл / нэвтрэлт | Auth нь CANDIDATE оноодог; email verification шалгадаг; portal bearer client бий | Runtime-д ижил хэрэглэгчийн session найдвартай дамжих |
| Профайл / onboarding | Бодит API, completion, document/OTP UI бий | Шалгалтад үнэхээр шаардах мэдээллийг л шаардах; unavailable SMS-ийг ойлгомжтой харуулах |
| Миний үнэлгээ | Шууд mock жагсаалт, бүх CTA нэг mock attempt руу | Өөрт оноосон, хугацаа/төлөвтэй бодит жагсаалт |
| Каталог | Schedule DB-ээс уншдаг боловч eligibility зөрүүтэй | Зөвшөөрөгдсөн шалгалт, server-authoritative next action |
| Кодоор нэгдэх | Demo success toast; код шалгахгүй, mock waiting link | Код → баталгаатай assignment → өөрийн attempt |
| Waiting room | Countdown, preload/start, instruction checkbox UI бий | Хуваарь, consent, эрхийг backend батлах; retry-safe start |
| Шалгалт өгөх | Adapter auth дутуу; үндсэн хоёр сонголтот renderer + textarea | Authenticated runtime, зөв question type, баталгаатай save/recovery |
| Дуусгах | Backend receipt API бий; UI mock receipt үүсгэнэ | Серверийн accepted receipt гарсны дараа амжилт харуулах |
| Үр дүн | Тогтмол 85%; reporting production-д хаалттай | Оноолттой, grading/release policy хангасан бодит дүн |
| Нэмэлт үйлчилгээ | Payment/wallet/certificate/group/notification ихэнх нь mock | Бодит API-тай болгох эсвэл эхний хувилбарын navigation-аас хасах |

## 4. Батлагдсан алдаа ба эрсдэл

Түвшин: **P0** — бодит шалгалт нээхээс өмнө засна; **P1** — үндсэн урсгалтай хамт засна; **P2** — дараагийн бүтээгдэхүүний сайжруулалт.

### C01 — P0: Production attempt үүсгэх зам зориудаар хаалттай

`services/execution/src/execution.service.ts:188` дахь `createAttempt()` production үед 503 буцаана. Production бус үед зөвхөн гурван demo assessment таньж, `candidate-001` хэрэглэгч, mock асуултууд үүсгэнэ. Каталогийн бодит schedule ID-г published revision-ээс materialize хийх зам байхгүй.

Засвар: энэ хоригийг зүгээр авч болохгүй. Бодит schedule, assignment, candidate identity, pinned quiz revision-ээс attempt/question snapshots үүсгэж дууссаны дараа production замыг нээнэ. Нэг хэрэглэгчийн active attempt-ийг давхар үүсгэхгүй; retry-д өмнөх attempt-ийг буцаана.

### C02 — P0: Runtime authentication portal-оос тасарсан

`apps/assessment-web/src/features/runtime/adapter.ts` бүх HTTP дуудлагад bearer token нэмдэггүй. `useAssessmentRuntime.ts:207` SSE нь энгийн `EventSource`; gateway нь bearer token-оос identity гаргадаг (`services/gateway/src/proxy.middleware.ts:176`). Portal-ийн `authFetch` integration runtime-д байхгүй. Cookie credential нэмэх дан өөрчлөлт хангалтгүй — gateway refresh cookie-г access identity болгон уншдаггүй.

Засвар: runtime session bootstrap/refresh болон нэг authenticated transport; 401 үед login return URL ба unsent buffer хадгалах. SSE-д authenticated fetch-stream эсвэл богино хугацаатай, attempt-д хязгаарласан stream credential сонгох; урт хугацааны access token URL-д хийхгүй. Native EventSource header хязгаарлалтыг тооцно.

### C03 — P0: Давтан start хугацааг сунгана

`execution.service.ts:410`: active attempt дээр дахин start дуудахад `startsAt=now`, `endsAt=now+duration` дахин бичигдэнэ. Audit-ийн idempotency нь state update-ийг хамгаалахгүй. Хаалтын хугацаа, acknowledgement, бодит eligibility-г хангалттай шалгахгүй; terminal төлөвт ч unlock key гаргаж өгдөг.

Санах ойн reproduction: цагийг 60 секунд урагшлуулаад start давтахад **deadline +60000 ms**.

Засвар: зөвхөн CREATED → IN_PROGRESS шилжилт нэг удаа; DB transaction/lock; active retry өмнөх start/deadline/key-г буцаах. Deadline нь schedule-ийн бодлого, duration-оос серверээр тогтоогдоно. Terminal attempt start татгалзана.

### C04 — P0: Хуучин autosave шинэ хариултыг дарж чадна

`execution.service.ts:596,617`: client-ийн localVersion-ийг серверийн save count-той харьцуулдаг. Энэ нь хоёр өөр тоолуур. Version 10-ийн дараа ирсэн version 9 серверийн version 1-ээс их тул зөвшөөрөгдөнө.

Reproduction: q1=`new`, localVersion=10 хадгалсны дараа q1=`stale`, localVersion=9 илгээхэд эцсийн хариулт **stale** болсон.

Засвар: persisted lastClientSequence, client instance/session ownership, server revision-ийн тусдаа contract; transaction/CAS; ижил sequence өөр payload бол conflict; хоцорсон sequence шинэ snapshot-ийг өөрчлөхгүй. Хоёр tab-ийн бодлогыг тодорхой болгох.

### C05 — P0: Хугацаа хэтэрсэн submit-ийг client-ийн reason-оор зөвшөөрнө

`execution.service.ts:715` дахь `timer_expired`/`offline_expired` нь expired төлөвт final snapshot хүлээж авах нөхцөл болно. Серверийн хугацаатай хязгаарласан grace window байхгүй.

Reproduction: нэг хоногийн өмнө дууссан expired attempt-д `offline_expired` reason-той шинэ хариулт илгээхэд **accepted=true**.

Засвар: deadline-ийн дараа сервер дээр хадгалагдсан snapshot-ийг finalize хийх. Хожуу offline upload шаардлагатай бол grace/policy/тусгай review-г серверээр удирдах; client reason хугацааны эрх олгохгүй. Offline editable state мөн deadline дээр хаагдана.

### C06 — P0: Submit, snapshot, response, scoring event атомик биш

`execution.service.ts:788` session-ийг SUBMITTED болгоод дараа нь snapshot, audit, RabbitMQ publication хийдэг. `infrastructure/prisma-state-store.ts:204` snapshot болон question response-уудыг нэг transaction-гүй шинэчилдэг.

Эрсдэл: дунд нь процесс/DB/queue алдахад submitted боловч хариулт эсвэл scoring job дутуу; retry өөр branch руу орох. Энэ fault scenario production дээр туршаагүй, кодоор тогтоосон эрсдэл.

Засвар: snapshot+responses+submission receipt+state transition+outbox нэг transaction; queue publication тусдаа retryable worker; consumer idempotency. Receipt нь хүлээн авсан snapshot-ийн revision/checksum-тай байна.

### C07 — P0: Private schedule eligibility-г UI gate хамгаалахгүй

`services/assessment/src/catalog.service.ts` бүх OPEN/ACTIVE/SCHEDULED schedule-ийг авч, ASSIGNED_ONLY-гүй хэрэглэгчийг заавал хориглохгүй; assignment байхгүй ч бусад нөхцөл биелбэл allowed=true. Байгууллага, invitation, access code-ийн бүрэн gate алга.

`services/profile/src/profile.service.ts:156` enrollment, emailVerified, price, assessmentOpen зэргийг query input-оос үнэлдэг. Энэ нь readiness тайлбарт ашиглаж болох ч эрхийн эх сурвалж байж болохгүй. Auth login-ийн email verification нь бодит бөгөөд энэ олдвор түүнийг үгүйсгэхгүй.

Засвар: candidate identity, verified account, assignment status, schedule window, max attempts, org/code scope-ийг серверийн бодит өгөгдлөөс нэг eligibility service шийднэ. Create/start үед дахин шалгана. Private schedule-ийн нэр/metadata-г зөвшөөрөгдөөгүй хэрэглэгчид жагсаахгүй.

### C08 — P0: Шалгалт эхлэхээс өмнө асуулт авах боломжтой бүтэц

`execution.service.ts:320` getSession нь waiting төлөвийг ялгалгүй questions буцаана. Prisma store нь plaintext content/options өгдөг; encryptedPayload-д `mock.encrypted.payload` байна. Waiting UI-ийн “кодлогдож татагдана” тайлбар бодит хамгаалалтаар батлагдаагүй.

Засвар: эхлэхээс өмнө metadata/manifest л өгөх. Эхэлсний дараа эрхтэй candidate-д зөвхөн candidate-safe content өгөх; зөв хариу, rubric scoring key, private explanation-ийг allowlist serializer-аар хасах. Offline preload encryption хийх бол бодит encryption/key lifecycle тест шаардлагатай; эхний хувилбарт энгийн server-gated payload илүү тодорхой.

### C09 — P0: Autosave/submit UI амжилтыг хэт эрт зарлана

`useAssessmentRuntime.ts:448` periodic autosave нь accepted шалгахгүйгээр saved/dirty state шинэчилнэ, rejection handling дутуу. `submitAttempt()` response.accepted шалгалгүй submitted төлөв оноож local storage clear хийнэ. `runtimeSnapshotStorage.save()` алдаа console-д бичээд caller-д амжилтгүйг мэдэгдэхгүй.

Засвар: серверийн баталгаажуулсан revision-ийг л saved гэж тэмдэглэх; хуучин response шинэ dirty answer-ийг цэвэрлэхгүй. Submit татгалзсан/сүлжээ тасарсан үед buffer, pending intent хадгалах. Local quota/private mode failure-д ил warning, дахин хадгалах/татаж авах боломжийн бодлого. Pending submit-ийн idempotency key retry бүрт тогтвортой байна.

### C10 — P0: Бодит биш дүн ба receipt production-д харагдана

Browser-оор нэвтрэлгүй шалгасан:

- `https://quiz.seek.mn/assessment/result`: **“Амжилттай давсан”, “Нийт оноо: 85%”** — статик.
- `/submitted/audit-nonexistent`: **“Шалгалт илгээгдлээ”, “receipt-audit-nonexistent”** — ID-гаас зохиосон receipt.
- `/join/AUDIT-NONEXISTENT`: кодыг validation хийхгүй, mock waiting room link өгнө.
- `/waiting/audit-nonexistent`: “Буруу attempt”; console-д `Failed to recover session`. Auth/network/404 ялгахгүй.

Засвар: статик дүнг production route-оос хаах/бодит API-д холбох; receipt-ийг байгаа `GET /execution/runtime/attempts/:id/receipt`-ээс унших. pending, forbidden, not found, expired, locked, submitted, grading, released тусдаа төлөв. Байхгүй ID-д амжилт хэзээ ч харуулахгүй.

### C11 — P1: Миний үнэлгээ, join, recovery замууд demo

`apps/portal-web/src/app/(candidate)/my-assessments/page.tsx` бүх карт `mock-attempt-001` рүү явна. Portal `/take/[attemptId]` тусдаа mock runtime. Assessment `/connection-lost` мөн mock attempt руу буцна. Join код arbitrary string байхад success toast үзүүлдэг.

Засвар: нэг canonical runtime (`assessment-web`); portal take route бодит attempt route руу шилжих эсвэл unavailable болгох. “Миний үнэлгээ” бодит assignment API; resume нь өөрийн active attempt; recovery нь анхны attempt ID-г алдахгүй. Join success нь backend баталгаажсаны дараа л гарна.

### C12 — P1: Renderer authoring-ийн төрлүүдтэй нийцэхгүй

`apps/assessment-web/src/app/take/[attemptId]/page.tsx:278` зөвхөн single_choice, multiple_choice тусгай renderer; бусад бүх type textarea. Authoring нь TRUE_FALSE, NUMERIC, MATCHING, ORDERING, MATRIX, LIKERT, SJT, CASE_BUNDLE зэрэг олон төрөлтэй. State store төрөл код, content/options-ийг шууд дамжуулдаг тул uppercase enum, id/label, body/prompt shape-ийн mapping contract хэрэгтэй.

Засвар: authoring→published snapshot→runtime answer→scoring гэсэн type бүрийн contract. Эхний production хувилбарт дэмжигдээгүй төрөлтэй quiz schedule-ийг publish хийхэд хориглож тайлбарлах; textarea руу чимээгүй буулгахгүй. Media, math, nested items, max score, accessibility хамт шалгана.

### C13 — P1: Catalog filter ба metadata authorization зөрүүтэй

Candidate catalog нь assessor metadata `fetchAudienceTypes()` дуудна. Одоогийн guard CANDIDATE-д энэ authoring endpoint-ийг хориглодог — зөв хамгаалалт боловч candidate UI буруу endpoint ашиглаж байна. Catalog DTO audienceTypeId буцаахгүй байхад UI түүгээр filter хийнэ; API query параметрүүдийг controller хэрэглэдэггүй.

Засвар: candidate-safe catalog facets/filters; authoring permission-ийг өргөжүүлэхгүй. Серверийн pagination/filter contract, DTO, filter selection-ийг нийцүүлэх. `passingPercent=60`, `passingScore*10` зэрэг зохиомол score тооцоог revision-ийн бодит оноогоор солино.

### C14 — P1: Consent, navigation, proctoring-ийн UI/backend parity дутуу

Instruction acknowledgement API бий боловч runtime adapter түүнтэй холбогдоогүй; checkbox client state. Start нь acknowledgement шаарддаггүй. Navigation API байгаа ч UI local navigation давамгай. Client visibility/fullscreen events дангаараа үнэлгээний сахилгын баталгаа биш.

Засвар: accepted instruction version/hash серверт хадгалах; navigation/lock бодлогыг серверийн төлөвтэй нийцүүлэх. Focus алдагдсан бүрийг шууд зөрчил гэж шийтгэхгүй; mobile/fullscreen боломж, accessibility exception, admin review ба unlock audit бодлого гаргах.

### C15 — P1: Scoring → result release бүрэн холбогдоогүй

Execution `attempt.scoring.requested` publish хийдэг ч одоогийн services хайлтаар түүнийг боловсруулах бүрэн grading consumer олдоогүй. Reporting нь attempt.submitted/result.finalized consume хийдэг боловч production-д disabled; initial projection-д default quiz/candidate ID fallback байна. Candidate result API/UI нь mock.

Засвар: published questionVersion snapshot-аар deterministic auto scoring; шаардлагатай төрлийг manual-review queue руу; grading ба publication-ийг тусдаа state. Candidate зөвхөн өөрийн, зөвшөөрсөн талбар бүхий нийтэлсэн үр дүн харна. Reporting-г дангаар асаах нь үүнийг шийдэхгүй; default identity fallback-ийг арилгана. Appeal/contact, release time, withheld reason хэрэгтэй.

### C16 — P1: Signature production-д унтраалттай, асаах бэлтгэл дутуу

Container ба compose хоёул ENABLE_SIGNATURE_VERIFICATION=false. HTTP adapter signature headers илгээхгүй. Guard nonce replay check нь Redis EXISTS→SET хоёр тусдаа үйлдэл; system signing key fallback мөн нягтлах шаардлагатай.

Засвар: authorization-ийг эхэлж бүрэн холбох; HMAC төхөөрөмжийн итгэлцлийг орлохгүй. Signature-г ашиглах бол client/server canonical payload, key rotation, атомик nonce reservation, required production secret-ийг бүрэн тестлэсний дараа асаах. Flag-ийг зүгээр true болговол autosave/submit тасарна. Энэ нь өнөөгийн 401-ийн үндсэн шалтгаан биш — signature одоо bypass хийгдсэн.

### C17 — P1/P2: Profile OTP болон нэмэлт үйлчилгээний availability

Integration `sms.service.ts` production-д provider тохируулаагүй тул 503 буцаана. Profile/OTP UI байгаа нь SMS очих баталгаа биш. Payment, wallet, notifications, certificates, groups ихэнх нь mock; support/settings хэсэг бодит өөрчлөлтийн баталгаагүй.

Засвар: оноосон шалгалтын эхний хувилбарт шаардлагагүй үйлчилгээний live CTA-г хаах/цэснээс хасах; бодит холбоо барих тусламж үлдээх. SMS шаардлагагүй бол completion gate-д шаардахгүй; шаардлагатай үед provider, delivery status, rate limit, recovery шалгах. Төлбөр, сертификат дараагийн тусдаа ажлын багц.

## 5. UI/UX-ийн дэлгэрэнгүй үнэлгээ

### Navigation ба information architecture

Одоогийн header “Нүүр хуудас” → catalog, “Миний үнэлгээ” → mock; хэрэглэгч өөрийн хийх ажлыг шууд олохгүй. Search input нь handler-гүй, notification badge/товч бодит өгөгдөлтэй холбогдоогүй. Dashboard нь role mock summary.

Оноосон шалгалтын санал: default **Миний үнэлгээ**; navigation нь **Миний үнэлгээ · Үр дүн · Профайл · Тусламж**, “Кодоор нэгдэх” тусдаа тод CTA. Каталог нь зөвхөн нээлттэй үнэлгээ үнэхээр байгаа үед хоёрдогч цэс. Бодит бус мөнгө, сертификат, мэдэгдэл харуулахгүй.

### Миний үнэлгээний нэг карт

Шалгалтын нэр, байгууллага, timezone бүхий эхлэх/хаах цаг, хугацаа, асуултын тоо, оролдлогын үлдэгдэл, төлөв, ганц үндсэн үйлдэл. Upcoming → “Заавар харах”; ready → “Хүлээлгийн өрөө”; active → “Үргэлжлүүлэх”; submitted/grading → “Илгээсэн баримт”; released → “Үр дүн харах”. Assignment байхгүй бол тусламж/кодтой empty state; API алдааг хоосон жагсаалт гэж үзүүлэхгүй.

### Waiting room ба exam runtime

- Хэрэглэгчид “payload”, “unlock key”, “Redis”, “client buffer”, “production contract” гэсэн implementation текст хэрэггүй; “Шалгалт бэлтгэгдэж байна”, “Хариулт төхөөрөмж дээр хадгалагдсан, серверт илгээгдээгүй” гэж бодит төлөв тайлбарлах.
- Loading, session expired, no permission, unknown attempt, server unavailable тусдаа. RecoverSession rejection catch дутуу тул одоо буруу attempt гэсэн төөрөгдүүлсэн төлөв үүсдэг.
- Header: бодит timer, connection, saved state. Timer-ийг серверийн deadline-оор удирдах; deadline өнгөрөхөд answer editable үлдэхгүй.
- Navigator: одоо aria-label бүхий асуултын товчтой сайн суурь бий. Одоогийн/хариулсан/алдаатай/дараа харах төлөвийг өнгөнөөс гадна текст/icon-оор ялгах; шинэ асуултад focus шилжүүлэх.
- “Тест дуусгах” нь одоо шууд submit; хариулаагүй/хадгалагдаагүй тоо бүхий confirm modal хэрэгтэй. Давхар submit хаах; offline үед accepted receipt-гүй “амжилттай” гэж зарлахгүй.
- “Expired/locked” session-ийг hook `submitted` объектод хийж, take UI “Шалгалт илгээгдсэн” гэж харуулдаг; submission acknowledgement ба terminal status-ийг тусад нь загварчлах.
- Mobile дээр асуулт үндсэн зайг эзэлж navigator drawer, primary action доод хэсэгт; keyboard гарсан үед input, save status, үйлдлийг халхлахгүй.

### Visual consistency, localization, accessibility

- Portal header/cards-д fixed white/slate, runtime-д өөр shell, монгол/англи technical copy холилдсон. Shared theme tokens, нэг нэршил, нэг алдааны хэв маяг, MN/EN dictionary ашиглах.
- My assessments badge 9px, зарим чухал тайлбар text-xxs; жижиг текстийг томруулах. Contrast failure гэж хэмжээгүйгээр зарлахгүй — өнгөний бүх төлөвийг хэмжиж батлах.
- Search-д accessible label; profile dropdown/mobile drawer-д keyboard, Escape, focus return, expanded state; textarea-д programmatic label; radio group-д асуултын нэр. Modal-ийн focus trap бүрийг тестлэх.
- Status message aria-live; timer-ийг секунд тутам screen reader-аар уншуулахгүй. Focus visibility, error identification, target size, zoom/reflow-г WCAG 2.2 AA зорилтот шалгалтаар батлах.
- Browser-аар шалгасан static result page 375px viewport-д scrollWidth=375 байсан. Энэ ганц хэмжилт бүх app mobile-ready гэдгийг батлахгүй.

### Self-service агуулга

Profile: хэрэгтэй/заавал биш талбар, мэдээлэл цуглуулах шалтгаан, upload төрөл/хэмжээ, verification pending/rejected болон retry. Support: бодит холбоо барих мэдээлэл, attempt/receipt reference-ийг аюулгүй хавсаргах; нууц үг/хариултыг support form-д шаардахгүй. Result: grading хүлээж буй эсэх, release time, зөвшөөрсөн feedback, алдаа мэдээлэх арга. Certificate/payment хэрэгжээгүй бол амлалт өгөхгүй.

## 6. Шалгалтын үр дүн ба дутуу хамрах хүрээ

Execution test suite-г checker-ийн NODE_ENV=production өвлөсөн эхний ажиллуулалтаар 14 test fail болсон. Энэ нь demo fixture хамгаалалт болон KMS test environment-ийн шалтгаантай; бүтээгдэхүүний 14 алдаа гэж тооцоогүй. `NODE_ENV=test` гэж зөв тохируулахад **4 suite, 21 test бүгд pass**. Тестлэсэн execution service/owner guard-ийн SHA256 ажлын эх кодтой ижил.

21 test pass боловч дараах 3 нэмэлт reproduction мөн батлагдсан:

| Туршилт | Ажигласан үр дүн | Хүлээгдэх зөв үр дүн |
|---|---|---|
| Start давтах | Deadline +60000 ms | Өмнөх deadline хэвээр |
| Save v10 → v9 | v9 шинэ хариултыг дарсан | v10 хэвээр; stale request татгалзах |
| Нэг хоног хоцорсон offline submit | accepted=true | Бодлогоор татгалзах/хяналтад шилжүүлэх |

Шинэ regression suite зайлшгүй: хоёр CANDIDATE-ийн IDOR, unassigned access, revoked assignment, duplicate join/start/submit, parallel autosave, old response/new typing, deadline boundary, tab conflict, reload without unlock, offline reconnect, storage quota, auth refresh, unsupported question type, scoring retry, result hidden/released, no fabricated receipt. Production fake fixture оруулахгүй.

## 7. Засварын ажлыг зохион байгуулах дараалал

Энэ нь аудитын үндэслэлтэй ажлын багц; бүх migration/API field-ийг нэг мөр болгосон эцсийн implementation spec биш. Хугацааны grace, олон төхөөрөмж, manual grading-ийн хариуцагч зэрэг бүтээгдэхүүний бодлогыг хэрэгжүүлэхийн өмнө түгжинэ.

| Үе | Хүргэх зүйл | Дууссан гэж үзэх нөхцөл |
|---|---|---|
| A. Итгэлцэл ба хамгаалалт | C10 demo дүн/receipt хаах; unavailable CTA; 401/403/404 UI; P0 regression tests | Байхгүй/татгалзсан attempt амжилттай харагдахгүй |
| B. Оноолт ба entry | Candidate-safe assignment list, code redemption, eligibility, authenticated runtime transport, production materialization | Нэг candidate зөвхөн өөрт оноосон published revision-ээс бодит attempt авна |
| C. Runtime найдвартай байдал | C03–C06, C08–C09; transaction/outbox, snapshot contract, type serializers, receipt | Refresh/offline/retry/concurrency үед хариулт алдахгүй, хугацаа сунгахгүй |
| D. Бодит үр дүн | Scoring/manual grading, release policy, candidate result projection | Хүлээн авсан snapshot-ийн бодит үр дүн зөвхөн эзэнд зөв үед харагдана |
| E. UI/UX ба pilot | Live My assessments, states, confirm, mobile, keyboard, MN/EN; хязгаарласан туршилт | Нэвтрэх→оноосон шалгалт→өгөх→баримт→дүн тасралтгүй ажиллана |
| F. Нэмэлт үйлчилгээ | SMS, notification, support tickets, certificate/payment тусдаа багц | Provider, API, UI, failure recovery бүрэн батлагдсан |

### Интерфэйс ба өгөгдлийн чиглэл

- Candidate query endpoints-ийг authoring metadata-гаас салгана: өөрийн assignments, catalog facets, own attempt summary, own published result.
- Одоо байгаа execution attempt/start/autosave/submit/receipt замуудыг хадгалж, DTO/state/accepted/conflict семантикийг тодруулна; legacy client compatibility-г regression тестээр хянах.
- Attempt үүсгэлт authenticated subject-аас candidateId авна. Assessment DB-ийн schedule/assignment ба execution DB-ийн snapshot хооронд retryable idempotent contract; cross-database transaction гэж үзэхгүй. Schedule/revision identity, policy version, content checksum дамжина.
- Quiz/question published хувилбар snapshot тогтвортой; шалгалт эхэлсний дараах authoring edit candidate attempt-ийг өөрчлөхгүй.
- Receipt ба result тусдаа resource. Receipt submit acceptance; result grading/release. UI өөрөө аль алиныг зохиохгүй.
- Schema-д assignment/eligibility snapshot/attempt/submission/audit бүтэц аль хэдийн бий. Шинэ хүснэгт нэмж эхлэхээс өмнө ашиглалт, unique constraint, outbox ба CAS багануудыг тулгаж migration-ийн нарийн хүрээг тогтооно.

### Rollout ба мониторинг

Тусгаарласан DB/2 candidate/1 admin fixture дээр бүх урсгал; backend/API compatibility эхэлж, runtime+portal дараа; image digest ба DB backup; migration backward compatible. Production pilot нь зөвшөөрсөн бодит schedule дээр хязгаарлагдана. Алдаанд өмнөх image рүү буцна; accepted answers/receipts-ийг хуучин backup-аар дарж болохгүй.

Хянах үзүүлэлт: join/start error by reason, auth refresh failure, autosave latency/reject/stale conflict, unsynced duration, submit receipt success, outbox age, grading lag, result release lag. Log-д access token, answer body, registry number оруулахгүй. Байгууллагын шалгалтын бодит нэгэн зэрэг оролцогчдын тоо тодорхой болсны дараа load target/SLO-г тогтооно; энэ аудит тоо зохиогоогүй.

## 8. Хадгалах сайн суурь

Auth registration CANDIDATE оноож, login email verification хийдэг. Gateway client-supplied identity header-ийг strip хийж JWT-ээс identity гаргадаг. AttemptOwnerGuard өөр хэрэглэгчийн attempt access-ийг хориглодог; production mock unlock route хаалттай. Profile completion/API, Prisma persistence, explicit start/receipt endpoints, runtime navigator/save state/local encrypted storage-ийн суурь байгаа. Эдгээрийг бүхэлд нь дахин бичихээс илүү дээрх холбоос, transaction, policy gap-уудыг засна.

## 9. Гадаад стандартын лавлагаа

Fetch нь HTTP error status-д автоматаар reject хийдэггүй; response шалгалт ба credential тохиргоог тодорхой хийх шаардлагатай. [MDN — Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch).

Keyboard, focus, labels, status messages, reflow/contrast/target size-ийн QA-д WCAG 2.2 AA-г зорилт болгоно. Энэ аудит WCAG compliance сертификат биш. [W3C — WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/).
