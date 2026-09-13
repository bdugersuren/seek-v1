# Quiz бэлтгэх, хянах, нийтлэх

## Үнэлэгч

Blueprint-ийн жагсаалт, preview эсвэл editor-оос Quiz үүсгэнэ. Нэр, тайлбар, хугацаа, тэнцэх босго, оролдлогын тоог баталгаажуулсны дараа бодит Quiz editor нээгдэнэ. Хугацаа/босго Blueprint-ээс, оролдлого 1-ээс эхэлнэ.

Editor-ийн «Ерөнхий» хэсэгт тохиргоо; «Асуулт ба оноо»-нд хадгалсан question version, оноолт; «Шалгах ба нийтлэх»-д readiness, үйлдлийн түүх байна. «Шалгуулагчийн харагдац» нь хадгалсан snapshot-ийг үзүүлнэ; attempt үүсгэхгүй, хариулт хадгалахгүй, зөв хариултыг харуулахгүй.

Хэсэг, авах тоо, оноог Blueprint-ээс өвлөнө. «Заавал оруулах / хасах»-д сонголтоо тохируулж жишиг бүрэлдэхүүн шалгана. Жишиг нь хадгалсан бүрэлдэхүүн биш. «Асуултыг дахин бүрдүүлэх» нь одоогийн Blueprint-ээс бодит сонголт хийнэ. Ердийн хадгалалт асуултуудыг солихгүй.

Ноорог → Хяналтад илгээх. Хяналтын үед засвар түгжигдэнэ; зохиогч хяналтаас татаж болно. 409 нь өөр цонх шинэчилснийг заана: өөрийн өөрчлөлтөө авч үлдээд дахин ачаална.

## SUPER_ADMIN

`/admin/quizzes` хуудаснаас Quiz-ийг нээж тогтоосон revision-ийн асуулт, оноо, тохиргоог хянана. Өөрийн зохиосон Quiz-ийг өөрөө батлахгүй.

- Хяналтад байгаа → Батлах эсвэл тайлбартай Засварт буцаах.
- Батлагдсан → Нийтлэх эсвэл тайлбартай Засварт буцаах.
- Нийтэлсний дараа «Энэ хувилбараар хуваарь үүсгэх» холбоос одоогийн хуваарь/оноолтын хуудсанд revision-ийг сонгож нээнэ.

Нийтлэх нь оролцогчид шууд нээхгүй. Хуваарь/оноолт тусдаа. Эхэлсэн attempt, өмнөх нийтэлсэн revision өөрчлөгдөхгүй. «Шинэ ноорог хувилбар» сонгосон нийтэлсэн хувилбарын асуулт, бүх хуучин бодлогыг хуулна; идэвхтэй ноорог/хяналт/батлагдсан хувилбар байвал дахин үүсгэхгүй.

## API гэрээ

- `POST /assessment/quizzes`: `title`, `description?`, `blueprintId`, `expectedBlueprintVersion`, `requestId`, `durationMinutes?`, `passingScore?`, `maxAttempts?`, `questionOverrides?`. Actor-ийг authenticated header-ээс авна.
- `PUT /assessment/quizzes/:id`: `quizRevisionId`, `expectedVersion` болон засах тохиргоо. Override өөрчлөхөд `reselectQuestions:true` шаардлагатай.
- `GET /assessment/quizzes/:id?revisionId=...`: бодит revisions, selectedRevision, currentPublishedRevision, version, readiness, allowedActions, workflow.
- `GET /assessment/quizzes?paged=true`: эрхийн хүрээний items/total/page/pageSize/facets/summary. Хуучин array гэрээ хэвээр; detail шаардлагатай хэрэглэгч ID-аар уншина.
- `POST /assessment/quizzes/:id/preview`: revision/version/override-аар хадгалаагүй жишиг сонголт.
- `POST /assessment/quizzes/:id/revisions`: revision/version-аар шинэ ноорог хуулна.
- `POST /assessment/quizzes/:id/workflow`: `quizRevisionId`, `expectedVersion`, `requestId`, `action`, `comment?`. Сервер status болон actor-ийг тогтооно. `GET` нь түүх уншина.

Create/workflow-ийн ижил requestId дахин ирвэл давхар mutation үүсэхгүй. Ижил requestId, өөр payload 409. Шинэ `quiz_mutation_request` хүснэгт idempotency бүртгэл хадгална. Quiz.version нь засварын concurrency token; revisionNumber-оос тусдаа.

## Нэвтрүүлэлт ба буцаалт

`scripts/verify-quiz.py --browser` зөвхөн seek-verify fixture ашиглана. Unit config: `scripts/jest.quiz.config.cjs`.

`scripts/deploy-quiz-workflow.py` exact image verification gate шалгаад assessment DB-г нөөцөлж, тусгаарласан санд сэргээн release migration ажиллуулна. Дараа нь production additive migration болон assessment/gateway/portal шинэчлэлт хийнэ. Бусад контейнерийн ID хэвээр байх ёстой.

Шинэ workflow mutation үүссэн бол хуучин backend-ийн зөвхөн event бичдэг ажиллагаа руу буцаахгүй; нийцтэй image хадгалж засвар гаргана. Шинэ mutation байхгүй бол өмнөх image/env рүү буцааж болно. DB-г буцааж устгахгүй. Нөөц/env файл нууц мэдээлэлтэй тул нийтэд хавсаргахгүй.

Энэ ажил шинэ runtime төрөл, shuffle/result бодлого, төлбөр эсвэл оноолтын хөдөлгүүр нэмэхгүй. Өмнөх хадгалсан бодлогуудыг хадгалалт/хуулалтаар алдахгүй.
