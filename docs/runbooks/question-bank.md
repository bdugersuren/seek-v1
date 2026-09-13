# Асуултын сангийн жагсаалт, хариулт ба статистик

## Өгөгдлийн дүрэм

- `QuestionType`-ийн 13 canonical утга ашиглана. Portal жагсаалт, редактор, preview нь нэг icon registry ашиглана.
- Сонголтын `optionKey` нь хадгалагдсан хариултын тогтвортой ID; харагдах үсэг биш. Үсгийг `orderIndex`-д суурилан A…Z, AA… гэж гаргана. Metadata дахь `displayLabel` нь мөрийн нэр зэрэг төрөлд хамаарах нэмэлт дүрслэлийг хадгална.
- MATCHING `per_option`: option бүрийн `matchRules.matchValue` нь `scoringConfig.rightOptions[].id`-г заана.
- MATCHING `combination`: `scoringConfig.combinations[].ids` дотор `leftKey:rightKey` хосууд, `score` хадгална. Мөр бүр нэг удаа орсон, хүчинтэй reference байх ёстой.
- MATRIX: `scoringConfig.matrixColumns[{id,label}]`, мөр бүрийн `matchRules.matchValue` нь баганын ID. Одоогийн editor/runtime нь мөр тус бүрийн оноолттой. Матрицын хуучин `combination` draft-ийг батлуулахын өмнө `per_option` болгон тохируулна; published snapshot өөрчлөгдөхгүй.
- Тайлбар болон workflow comment нь зохиогчийн илгээх урсгалд сонголттой. Reviewer буцаах/татгалзах тайлбарын шаардлага хэвээр.

## Жагсаалтын API

`GET /api/v1/assessment/questions?bank=true&assessmentContextId=...&page=1&pageSize=20`

Нэмэлт query: `search`, таслалаар тусгаарласан `types`, `statuses` (жижиг үсэг), `difficulties` (контекстийн code), `topics`, `audiences`.

Буцаах: `{items,total,page,pageSize,facets}`. Хэмжээ 1–100; хүрээнээс хэтэрсэн хуудсыг сүүлийн хуудас руу тохируулна. Facet нь хандалтын эрхээр хязгаарлагдсан нийт сангийн тоо; сонгосон шүүлтүүрт хамаарах тоо нь `total`.

List DTO нь хамгийн сүүлийн хувилбарын summary, ангилал, хамгийн сүүлийн workflow event, зөвшөөрөгдсөн action, нийтлэгдсэн хувилбарын ID агуулна. Сонголт, answer key, медиа болон бүх хувилбарыг жагсаалтаар татахгүй. Preview/edit/copy нь дэлгэрэнгүйг тусад нь авна.

ASSESSOR-ийн guard-аас гарсан зөвшөөрөгдсөн асуултын ID-г **хуудаслалт, total, facets тооцоолохоос өмнө** query-д хэрэглэнэ. Хуучин array API бусад хэрэглэгчид зориулан үлдсэн.

## Статистик

Assessment нь хуудсанд гарсан зөвшөөрөгдсөн version ID-уудаар execution-ийн `POST /execution/internal/question-statistics` рүү хандана. Дотоод `CANDIDATE_INTERNAL_SECRET` шаарддаг; максимум 100 version. Хариу `schemaVersion: 1`.

- `usageCount`: эхэлсэн attempt-д орсон тухайн хувилбарын тоо.
- `gradedCount`: үр дүн нь `GRADED` болсон attempt-ийн тухайн асуултын үнэлгээний тоо.
- `correctCount`: дээд оноо авсан үнэлгээний тоо.
- Амжилтын хувь: `correctCount / gradedCount × 100`, түүврийн `n`-тэй.
- `averagePercentage`: хэсэгчилсэн онооны дундаж, API-д тусдаа утга.
- `asOf`: статистик тооцоолсон UTC хугацаа.

Оролдлого тус бүрийг тоолдог; өвөрмөц сурагчийн хувь биш. Үнэлгээ хүлээж буй attempt-ийг хасна. Үр дүнг засварлаад дахин үнэлэхэд одоогийн read model-оос дахин тооцно. Хувилбаруудыг хооронд нь холихгүй. `gradedCount=0` үед “Өгөгдөлгүй”; API тасарвал “Статистик түр боломжгүй”; LIKERT-д зөв/буруу хувь хэрэглэхгүй.

Энэ хувилбарт existing execution result read model-ийг баталгаажуулсан дотоод API-аар уншина. Шинэ event consumer эсвэл cross-service SQL байхгүй. Тусдаа материалжуулсан reporting projection, analytics индексийг цаашдын ачааллын хэмжилтэд үндэслэн нэмэх боломжтой.

## Runtime ба хуучин өгөгдөл

Шинэ attempt нь scoringConfig, option score, зөв харгалзааг шифрлэсэн grading snapshot-д хадгална. Candidate payload-д зөв хариулт/оноолтын түлхүүр орохгүй; зөвхөн matching right options, matrix баганын нэр харагдана.

ScoringConfig-гүй хуучин attempt snapshot нь хуучин exact-set choice бодлогоо хадгална. Шинэ choice нь per-option эсвэл exact combination оноолттой; quiz-ийн оноонд масштаблаж, тохируулсан min/max-д барина. MATCHING/MATRIX нь хадгалалт, reload, автомат үнэлгээтэй.

13 төрөл authoring/submit-д шалгагдана. Runtime-д өмнөх зургаан төрөл дээр MATCHING/MATRIX нэмэгдсэн; ORDERING/FILL_BLANK/LIKERT/SJT/CASE_BUNDLE-ийн өмнөх publication gate хэвээр. Энэ ажил тэдгээрийн runtime хөдөлгүүрийг шинээр хэрэгжүүлээгүй.

## Шалгах команд

Dependency орчинд:

```bash
NODE_ENV=test pnpm exec jest --config scripts/jest.question-bank.config.cjs --runInBand
pnpm --filter @seek/portal-web typecheck
pnpm --filter @seek/assessment typecheck
pnpm --filter @seek/execution typecheck
pnpm --filter @seek/assessment-web typecheck
```

`scripts/test-question-bank.cjs` нь зөвхөн `environment: seek-verify` stdin config авч PostgreSQL fixture үүсгээд цэвэрлэнэ; `browser:true` үед browser тест ажиллуулна. Connection strings болон test credentials-ийг stdout/репозиторт бичихгүй.

Бэлэн `seek-verify` болон `seek-check` орчинд `python3 scripts/verify-question-bank.py --browser` ажиллуулж API болон browser шалгалтыг давтана.

## Нэвтрүүлэлт ба буцаалт

Schema migration шаардахгүй. Assessment/execution backend, portal-web, assessment-web дөрвөн сервисийг л солино. Өмнөх image tag, assessment/execution backup, runtime-ийн service ID-уудыг `.production/evidence/question-bank/` дотор хамгаалалттай хадгална.

Буцаахдаа өмнөх дөрвөн image tag-ийг сэргээж Compose `up --no-deps --no-build --pull never` ажиллуулна. DB reset хийхгүй. Өмнөх runtime шинэ MATCHING/MATRIX attempt-ийг дэмжихгүй тул ийм active attempt байвал runtime rollback-оос өмнө тэдгээрийг дуусгах эсвэл зассан image-ээр урагш нэвтрүүлэх шаардлагатай.
