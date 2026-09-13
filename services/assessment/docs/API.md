# assessment API

## Асуултын сангийн шинэ жагсаалтын API

Гэрээ, эрх, шүүлтүүр, статистикийн тодорхойлолт: [Question bank runbook](../../../docs/runbooks/question-bank.md).

## Blueprint сан ба readiness (2026-09-13)

- `GET /blueprints?paged=true&assessmentContextId=...&page=1&pageSize=12` — эрхийн хүрээний `items`, `total`, `page`, `pageSize`, `facets`, `summary`. `paged` байхгүй үед хуучин array гэрээ хэвээр.
- `GET /blueprints/candidates?assessmentContextId=...&search=...&page=1&pageSize=20` — нийтлэгдсэн, runtime дэмждэг, тухайн хэрэглэгч/контекстийн сонгох боломжтой асуултууд.
- `POST /blueprints/preview` — хадгалаагүй тохиргооны readiness, шалтгаан, хэсгийн хүрэлцээ, жишиг сонголт.
- `POST /blueprints/:id/duplicate` — шинэ код, шинэ хэсгийн ID-тай ноорог; Quiz холбоос хуулахгүй.
- `PUT /blueprints/:id` — `version` шаарддаг optimistic lock; хэсэг бүрийн `id`-г хадгална. Зэрэг засвар эсвэл ашиглагдсан хэсгийн устгалд 409.

Үндсэн payload: `name`, `code?`, `description?`, `assessmentContextId`, `topicId?`, `defaultDurationMinutes`, `defaultPassingScore`, `lifecycleStatus: DRAFT|ARCHIVED`, `sections`. Хэсэг: `id?`, `name`, `description?`, `sectionMode: FIXED|RULE_BASED`, `selectedQuestionIds`, `randomPickCount`, `pointsPerQuestion`, `selectionRules`.

`selectionRules` нь `{schemaVersion:1, topicIds?:string[], includeDescendants?:boolean, types?:QuestionType[], difficultyLevelIds?:string[], audienceLevelIds?:string[]}`. Нэг талбарын сонголтууд OR, талбарууд AND. Actor-ийг authenticated header-ээс авна.

Readiness: `READY|NEEDS_ATTENTION|UNAVAILABLE`; lifecycle-ээс тусдаа. Ашиглалт нь бодит `usageCount`; detail-д эзэмшигчийн сүүлийн 20 `linkedQuizzes` ба тогтоосон асуултууд ирнэ. Quiz үүсгэх transaction дотор хүрэлцээ, published version, давхардалгүй allocation дахин шалгагдана. `PUT /quizzes/:id` дахь `reselectQuestions:true` нь ноорогийн илэрхий дахин сонголт; ердийн засвар өмнөх сонголтыг солихгүй.

## Quiz бэлтгэх, батлах, нийтлэх (2026-09-13)

Quiz endpoint-ууд одоо бодит revision төлөв өөрчилнө. Create-д `expectedBlueprintVersion/requestId`, update-д `quizRevisionId/expectedVersion`, workflow-д `quizRevisionId/expectedVersion/requestId/action` шаардлагатай. Update нийтэлсэн хувилбараас автоматаар шинэ revision үүсгэхгүй; `POST /quizzes/:id/revisions` ашиглана. `POST /quizzes/:id/preview`, `GET /quizzes/:id/workflow`, `GET /quizzes?paged=true` нэмэгдсэн. Actor болон шилжилтийн төлөвийг сервер тогтооно; зохиогчоос өөр SUPER_ADMIN баталж нийтэлнэ.

Бүрэн гэрээ, хэрэглээ, idempotency болон нэвтрүүлэлт: [Quiz workflow заавар](../../../docs/runbooks/quiz-workflow.md).
