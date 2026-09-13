# Blueprint → Quiz → батлах → нийтлэх

## Хэрэгжүүлэлт

Blueprint жагсаалт, preview, editor-ийн Quiz үүсгэх үйлдэл нэг modal ашиглаж бодит ноорог үүсгээд editor рүү шилжинэ. Нэр, тайлбар, хугацаа, тэнцэх босго, оролдлогын тоо хадгалагдана. Mock fallback, хийсвэр төлөв/хандалт/үр дүнгийн утгыг шинэ Quiz урсгалаас авсан.

Quiz-ийн хэсэг/авах тоо/оноо Blueprint-ээс өвлөгдөнө. Заавал оруулах/хасах сонголтыг урьдчилан шалгаж, илэрхий дахин бүрдүүлэх үйлдлээр хэрэгжүүлнэ. Ердийн хадгалалт бүрэлдэхүүн өөрчлөхгүй. Шалгуулагчийн preview хариултын түлхүүр харуулахгүй, attempt үүсгэхгүй.

`Quiz.version` нь concurrency token болсон. Хуучирсан өөрчлөлт 409 авч, editor бичсэн утгыг хадгална. Create/workflow-ийн requestId бүртгэл давхар үйлдлээс хамгаална. Request-ийн хуурамч actor/status-ийг ашиглахгүй.

Өөр SUPER_ADMIN хянаж буцаах/батлах/нийтлэх урсгал бодит revision төлөв, audit, published pointer-ийг transaction-аар шинэчилнэ. Өөрийн Quiz-ийг өөрөө батлахгүй. Нийтэлсэн revision өөрчлөгдөхгүй; шинэ ноорог хувилбар нь асуулт, бүх хуучин policy-г хуулна. Админ нийтэлсэн revision-ийг одоогийн хуваарийн хуудсанд сонгож нээж болно.

## Шалгалт

- 9 suite-ийн 77 unit/regression тест тэнцсэн.
- Assessment/gateway/portal typecheck тэнцсэн.
- PostgreSQL: create retry, payload зөрчил, concurrent 409, review return/approve/publish, self-review хориг, давхар publish, snapshot/policy хуулалт, илэрхий reselection, хүчингүй асуулт, scoped pagination тэнцсэн.
- Browser: хоёр тусдаа хэрэглэгчээр Blueprint-ээс үүсгэх, хадгалах/reload, override/preview, 409 үед input хадгалах, админы бүрэн workflow, хуваарийн revision deep link, шинэ ноорог, retry/эрх цуцлалт тэнцсэн.
- Найман дэмжигддэг төрлийн үнэлэгч/шалгуулагч preview шалгасан. 375/768/1280/1440px layout/overflow, native modal focus/Escape шалгасан. Иж бүрэн WCAG аудит хийгээгүй.
- MATCHING/MATRIX runtime-ийн candidate эхлүүлэх/хадгалах/reload/илгээх/үнэлэх/дүн нийтлэх болон эрхийн тусгаарлалтын regression тэнцсэн.

## Production нэвтрүүлэлт — 2026-09-13

Assessment өгөгдлийн сангийн нөөцийг тусгаарласан түр PostgreSQL санд сэргээж, яг release image-ээр additive migration шалгасан. Дараа нь production-д `20260913020000_quiz_workflow` migration болон assessment/gateway/portal шинэчлэл амжилттай хийгдэв. Бүх 14 сервис healthy; бусад 11 сервисийн container ID өөрчлөгдөөгүй.

- Backend: `seek-backend:quiz-workflow-20260913` — `sha256:ca8613c8775e100baf1f58656ca4eac35d0a63fb1383d4658eaff1e9977713d6`.
- Portal: `seek-portal-web:quiz-workflow-20260913` — `sha256:23549646884caae5d596004659da98fb69b0fa5ac9586ab073c86d2472067935`.
- Нөөц ба өмнөх image тохиргоо: `.production/evidence/quiz-workflow/production-before-20260913-023329/` (хязгаарласан эрхтэй).
- HTTPS smoke: нүүр ба API readiness 200; нэвтрээгүй assessor/admin Quiz болон candidate нүүрийн redirect 307 — хүлээгдсэн үр дүн.
- Бүрэн workflow/browser тестийг seek-verify орчинд өөрийн fixture-үүдээр хийж цэвэрлэсэн. Production-д зөвхөн өгөгдөл өөрчлөхгүй smoke шалгалт хийсэн.

Нотолгоо: `.production/evidence/quiz-workflow/` дахь `browser-release.log`, `checks.log`, `production-result.json`, `smoke.json`. Шинэ workflow mutation үүссэний дараа хуучин semantics-тэй image рүү буцаахгүй; нийцтэй image-ээр сэргээнэ. Additive хүснэгт/өгөгдөл устгахгүй.

## Screenshot

- [Quiz үүсгэх](../../.production/evidence/quiz-workflow/screenshots/create.png)
- [Editor 375px](../../.production/evidence/quiz-workflow/screenshots/editor-375.png)
- [Асуулт ба оноо 1440px](../../.production/evidence/quiz-workflow/screenshots/questions-1440.png)
- [Найман төрлийн үнэлэгчийн харагдац](../../.production/evidence/quiz-workflow/screenshots/eight-types-author.png)
- [Шалгуулагчийн preview 375px](../../.production/evidence/quiz-workflow/screenshots/eight-types-preview-375.png)
- [Override-ийн жишиг сонголт](../../.production/evidence/quiz-workflow/screenshots/override-preview.png)
- [409 үед өөрчлөлт хадгалах](../../.production/evidence/quiz-workflow/screenshots/conflict.png)
- [Батлагдсан](../../.production/evidence/quiz-workflow/screenshots/approved.png)
- [Нийтэлсэн](../../.production/evidence/quiz-workflow/screenshots/published.png)
- [Хуваарийн холбоос](../../.production/evidence/quiz-workflow/screenshots/schedule-link.png)
- [Шинэ ноорог](../../.production/evidence/quiz-workflow/screenshots/new-revision.png)
- [Quiz жагсаалт](../../.production/evidence/quiz-workflow/screenshots/list-1440.png)

## Хүрээ ба нийцэл

Нийтлэх нь хуваарь нээх/оролцогч оноох үйлдэл биш. Шинэ runtime төрөл, төлбөр, shuffle/result policy хэрэгжүүлээгүй. Хуучин policy хадгалалт/хуулалтаар хэвээр үлдэнэ. Өмнөх audit event-ээс нийтэлсэн төлөв зохиож backfill хийгээгүй.

Жагсаалтын payload серверээр хуудаслагдана; summary/facets-ийг эрхийн хүрээний мөрүүдээс тооцдог. Маш их өгөгдөлд SQL түвшний оновчлол тусдаа хэмжилт шаардлагатай.

[Ашиглалт, API, нэвтрүүлэлт ба буцаалт](../runbooks/quiz-workflow.md).

Дараагийн тусдаа ажлын санал: runtime-д үлдсэн таван төрлийг хэрэгжүүлэх; том өгөгдлийн жагсаалт/readiness гүйцэтгэлийг хэмжиж оновчлох.

## Найман төрлийн дэлгэрэнгүй screenshot

| Төрөл | Үнэлэгч | Шалгуулагчийн preview |
|---|---|---|
| SINGLE_CHOICE | [Харах](../../.production/evidence/quiz-workflow/screenshots/author-SINGLE_CHOICE.png) | [Харах](../../.production/evidence/quiz-workflow/screenshots/candidate-SINGLE_CHOICE.png) |
| MULTIPLE_CHOICE | [Харах](../../.production/evidence/quiz-workflow/screenshots/author-MULTIPLE_CHOICE.png) | [Харах](../../.production/evidence/quiz-workflow/screenshots/candidate-MULTIPLE_CHOICE.png) |
| TRUE_FALSE | [Харах](../../.production/evidence/quiz-workflow/screenshots/author-TRUE_FALSE.png) | [Харах](../../.production/evidence/quiz-workflow/screenshots/candidate-TRUE_FALSE.png) |
| SHORT_TEXT | [Харах](../../.production/evidence/quiz-workflow/screenshots/author-SHORT_TEXT.png) | [Харах](../../.production/evidence/quiz-workflow/screenshots/candidate-SHORT_TEXT.png) |
| NUMERIC | [Харах](../../.production/evidence/quiz-workflow/screenshots/author-NUMERIC.png) | [Харах](../../.production/evidence/quiz-workflow/screenshots/candidate-NUMERIC.png) |
| ESSAY | [Харах](../../.production/evidence/quiz-workflow/screenshots/author-ESSAY.png) | [Харах](../../.production/evidence/quiz-workflow/screenshots/candidate-ESSAY.png) |
| MATCHING | [Харах](../../.production/evidence/quiz-workflow/screenshots/author-MATCHING.png) | [Харах](../../.production/evidence/quiz-workflow/screenshots/candidate-MATCHING.png) |
| MATRIX | [Харах](../../.production/evidence/quiz-workflow/screenshots/author-MATRIX.png) | [Харах](../../.production/evidence/quiz-workflow/screenshots/candidate-MATRIX.png) |
