# Даалгаврын баталгаажуулалтын процессийн шинжилгээ

2026-09-12. Кодын шинжилгээ; production тохиргоо, өгөгдөл өөрчлөөгүй.

## Батлагдсан зөрүү
1. assessment-workflow.service.ts: pending, changes_requested, rejected үйл явдал QuestionVersion төлөвт бүрэн тусахгүй. IN_REVIEW enum бэлэн боловч pending шилжилт ашиглахгүй.
2. Клиент action/newStatus/actorUserId илгээдэг; үйлчилгээ зөвшөөрөгдсөн шилжилтийг шалгахгүй. ASSESSOR guard actor-ийг засдаг ч SUPER_ADMIN эрт bypass хийдэг тул админы actor клиентээс орж болно.
3. approve нь currentPublishedVersionId-ийг шинэчилдэг. Батлах ба нийтлэх утга холилдсон.
4. Question.update нь DRAFT бус хувилбарт шинэ draft үүсгэнэ; IN_REVIEW үед засварлахыг илэрхий хориглосон дүрэм байхгүй.
5. QuizService гурван газар currentPublishedVersion || versions[0] хэрэглэнэ. Батлагдаагүй draft quiz revision-д орох боломжтой.
6. Admin questions хуудас байгаа боловч тусгай хяналтын дэлгэц, тогтвортой review queue, хувилбарын түвшний шийдвэр дутуу. Refresh хүсэлтэд mock-assessor байна.
7. QuestionWorkflowEvent.questionVersionId, actorRole, QuestionVersion.reviewedBy/reviewedAt зэрэг багана бэлэн ч workflow бүрэн бөглөхгүй.
8. Батлуулах backend шалгалт нь одоогоор classification count; асуултын төрөл тус бүрийн агуулга/хариулт/онооны иж бүрэн validation биш.

## Санал болгож буй эхний хувилбар
ASSESSOR өөрийн, идэвхтэй оноогдсон контекстийн draft үүсгэнэ, засна, батлуулахаар илгээнэ. SUPER_ADMIN өөрийн зохиосон бус даалгаврыг хянана, тайлбартай буцаана/татгалзана, батална, нийтэлнэ. Байгууллагын админ болон REVIEWER_HR-д асуулт батлах эрх автоматаар нэмж болохгүй. Тусгай context-scoped reviewer эрхийг дараагийн шатанд шийднэ.

DRAFT -> IN_REVIEW -> APPROVED -> PUBLISHED -> RETIRED.
IN_REVIEW -> CHANGES_REQUESTED -> засвар -> IN_REVIEW.
IN_REVIEW -> REJECTED; дахин ашиглах бол тусдаа шинэ хувилбар/хуулбар үүсгэнэ.
IN_REVIEW -> DRAFT (зохиогч хүсэлтээ татах; нэг transaction-д concurrency шалгана).

Батлах ба нийтлэх хоёр тусдаа үйлдэлтэй байна. Нийтлэх нь интернэтэд ил гаргах биш, зөвшөөрөгдсөн үнэлгээнд ашиглахад бэлэн болгох төлөв; PRIVATE/TENANT/PUBLIC тусдаа бодлого хэвээр.

## Backend
- QuestionVersion.versionStatus нь үндсэн төлөв. API нэг canonical status буцаана; UI pending гэх тусдаа төлөв зохиохгүй.
- POST /assessment/questions/:id/workflow хадгалж action, questionVersionId, expectedRevision, comment, requestId DTO авна. newStatus ба actor-ийг сервер тогтооно.
- Төлөв+action+role+owner+context+version шалгалт; 403 эрх, 409 хуучирсан хувилбар/давтан буруу шилжилт, 400 validation алдаа.
- Төлөвийн update, audit event, reviewer fields, publication pointer нэг transaction-д. Conditional revision update эсвэл row lock. Ижил requestId давталтад давхар event/мэдэгдэл үүсгэхгүй.
- Save ба submit тусдаа бол submit хадгалсан яг хувилбар/revision-ийг шалгана. Save амжилттай, submit алдаатай үед UI ялгаж хэлнэ.
- Буцаах/татгалзахад тайлбар заавал. Submit-д body, төрөлд тохирох хариулт, оноо, контекст, идэвхтэй сэдэв/түвшин, файлын бэлэн байдал шалгана.
- IN_REVIEW болон батлагдсан/нийтлэгдсэн агуулгыг шууд өөрчлөхгүй. Нийтлэгдсэн v1 байгаа үед шинэ v2 draft нь v1-ийг солихгүй.
- Classification/онооны холбоосуудыг хувилбартай холбож snapshot хадгална; шинэ draft-ийн saveMappings хуучин нийтлэгдсэн ангиллыг устгаж болохгүй.
- Quiz сонголт зөвхөн PUBLISHED хувилбар. Draft fallback арилгана. Quiz revision questionVersionId-ийг тогтоож хадгална; одоо ажиллаж буй quiz-ийн агуулга шинэ нийтлэлээс өөрчлөгдөхгүй.

## UI
- ASSESSOR: Ноорог / Хяналтад / Засвар шаардсан / Батлагдсан / Нийтлэгдсэн / Татгалзсан таб, төлөвт тохирох үйлдэл, хянагчийн тайлбар, үйл явдлын түүх.
- SUPER_ADMIN: одоогийн /admin/questions-ийг хяналтын жагсаалт болгоно; сервер pagination/filter, context/author/type/date/status шүүлтүүр.
- Review detail: зөвхөн унших preview, хариулт/оноо/ангилал, хувилбарын ялгаа, түүх, Батлах / Засварт буцаах / Татгалзах / Нийтлэх.
- Сервер allowedActions буцааж UI түүнд тулгуурлана; backend эрхийг давхар хэрэгжүүлнэ.
- Апп дотор мэдэгдэл эхний шатанд. SMTP дараа нь outbox/retry-тай; имэйлийн доголдол төлөвийн transaction-ийг буцаахгүй.

## Schema ба шилжилт
Одоогийн version/audit талбаруудыг дахин ашиглана. expectedRevision-д зориулсан revision counter, requestId uniqueness, event-version FK, version-scoped classification болон шаардлагатай review/submission мэдээллийн migration-ийг бодит schema-тай тулгаж төлөвлөнө. Өмнөх event/version зөрүүг тайлагнаж, эргэлзээтэй өгөгдлийг автоматаар баталсан төлөвт оруулахгүй.

## Хэрэгжүүлэх дараалал ба хүлээн авах шалгалт
1. Domain дүрэм, эрхийн матриц, төлөвийн шилжилтийн тест.
2. Workflow API + validation + version/audit consistency + migration.
3. Quiz publication gate, versioned classification.
4. ASSESSOR submit/resubmit/withdraw ба review queue/detail.
5. App notification, шаардлагатай бол SMTP outbox.
6. Тусгаарласан хоёр аккаунтаар draft->submit->return->resubmit->approve->publish->quiz; хоёр админ зэрэг шийдвэрлэх, өөрийнхөө даалгаврыг батлах, эрх цуцлах, давхар submit, stale version, draft quiz-д оруулах оролдлогын тест.
7. Backup, шаардлагатай migration, assessment API дараа portal deploy. Өмнөх image-д буцахад шинээр үүссэн event/хувилбаруудыг устгахгүй. Schema compatibility-ийг буцаалтын өмнө батална.

Дууссан шалгуур: хяналтад орсон хувилбар өөрчлөгдөхгүй; буцаалтын тайлбар зохиогчид харагдана; батлах/нийтлэх эрх серверээр хязгаарлагдана; батлагдаагүй асуулт quiz-д орохгүй; бүх үйлдэл бодит actor, яг хувилбар, цагтай түүхэнд бүртгэгдэнэ.
