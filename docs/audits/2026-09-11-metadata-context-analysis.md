# Лавлах ба үнэлгээний контекстийн зохион байгуулалтын шинжилгээ

Огноо: 2026-09-11. Хүрээ: repository schema, CRUD/API, portal navigation/form, production-ийн зөвхөн унших SQL шалгалт. Энэ ажлаар application код, өгөгдөл, контейнер өөрчлөөгүй. Доорх шинэ дүрмүүд нь хэрэгжүүлэх санал; одоогийн боломжтой андуурахгүй.

## 1. Гол дүгнэлт

Audience management-ийн UI, typed API, validation, transactional hierarchy, error handling загварыг дахин ашиглана. Бүх лавлахыг нэг ижил мод эсвэл нэг generic database хүснэгт болгохгүй: төрөл тус бүрийн семантик ба constraint өөр.

Контекстийн шаардлагатай дөрвөн үндсэн FK: audienceTypeId, difficultyScaleId, cognitiveFrameworkId, competenceFrameworkId. audienceLevelId нь schema-д optional боловч одоогийн context form/CRUD түүнийг бүрэн дэмждэггүй. Topic нь контекст үүсгэх урьдчилсан нөхцөл биш; асуулт ангилах дараагийн шатны лавлах.

Шууд саад: CognitiveFramework, CognitiveLevel өгөгдөл байхгүй; framework CRUD нь зөвхөн GET, тусдаа admin цэс байхгүй. Бусад editor олон талбар илгээдэг ч backend тэдгээрийг орхидог.

## 2. Production-ийн бодит төлөв

| Хүснэгт | Мөр |
|---|---:|
| audience_type | 4 |
| audience_level | 21 |
| difficulty_scale | 2 |
| difficulty_level | 3 |
| cognitive_framework | 0 |
| cognitive_level | 0 |
| competence_framework | 1 |
| competence_type | 3 |
| assessment_context | 0 |
| topic | 5 |
| topic_question_classification | 0 |
| quiz_template | 0 |

DIFF_3_LEVEL: идэвхтэй, 3 идэвхтэй түвшинтэй. DIFF_5_LEVEL: идэвхтэй боловч түвшин 0. CompetenceFramework-ийн BLOOM кодтой мөр 3 идэвхтэй competence-тэй. Код дангаараа буруу ангилал гэдгийг батлахгүй; агуулгын зориулалтыг нягтлах хэрэгтэй. CompetenceFramework дахь BLOOM нь CognitiveFramework FK-г нөхөхгүй. Автоматаар шилжүүлэх/устгахгүй.

Бүх 5 Topic assessmentContextId=null, dangling context ID=0. Эдгээрийг контекст үүсгэсний дараа админы сонголтоор холбоно. Audience level-ийн тоо өмнөх гаргалтын 5-аас 21 болсон; одоогийн хэрэглэгчийн өгөгдлийг хадгална.

## 3. Эх кодын нотолгоо

- `services/assessment/prisma/schema.prisma`: DifficultyScale/DifficultyLevel 496+, CognitiveFramework/CognitiveLevel 531+, CompetenceFramework/CompetenceType 581+, AssessmentContext 622+, Topic 667+.
- `services/assessment/src/question.controller.ts`: cognitive-frameworks зөвхөн GET; бусад хуучин metadata endpoint-ууд олон any DTO-той.
- `services/assessment/src/question.service.ts:622`: Topic CRUD description/orderIndex/depth зэрэг UI талбарыг хадгалахгүй; эхний контекстийн fallback байна.
- `question.service.ts:683`: difficulty CRUD numericValue/minAbility/maxAbility/color/reportOrder/description/icon зэрэг талбарыг бүрэн хадгалахгүй; scaleId дутвал эхний scale сонгоно.
- `question.service.ts:724`: cognitive level create үргэлж эхний framework сонгоно; parent/framework сонголт CRUD-д бүрэн байхгүй.
- `question.service.ts:770`: context create дөрвөн FK тус бүрийг эхний мөрөөр нөхнө. audienceLevelId, огноо болон бусад context metadata хадгалахгүй.
- `question.service.ts:873`: competence framework/type description, parentId, orderIndex зэрэг талбарууд дутуу хадгалагдана.
- `question.service.ts:32–173`: question classification хадгалалт DEFAULT/dynamic context үүсгэж, олдоогүй cognitive/difficulty level-ийг эхний мөрөөр орлуулдаг. Олон framework-тэй болоход буруу ангилал хийх эрсдэлтэй.
- `apps/portal-web/src/app/superadmin/assessment-contexts/page.tsx`: дөрвөн lookup-ийг Promise.all-аар татна, эхний утгуудыг сонгоно; audienceLevel сонголтгүй; any state; алдаа гарсны дараа хоосон жагсаалт мэт харагдах боломжтой.
- `apps/portal-web/src/components/portal-shell.tsx:120`: одоогийн лавлах цэс topics, competencies, difficulty-scales, audience-types; cognitive-frameworks байхгүй.
- `services/gateway/src/proxy.middleware.ts:206`: tenant authorization бүрэн болох хүртэл assessment authoring SUPER_ADMIN-only. Энэ бодлогыг хадгална.

## 4. Санал болгож буй логик бүтэц ба цэс

| Цэс / зам | Зүүн хэсэг | Баруун хэсэг | Бүтэц |
|---|---|---|---|
| audience-types | Зорилтот бүлгийн төрөл | Түвшин | Шаталсан мод; одоо бэлэн |
| difficulty-scales | Хүндрэлийн хэмжүүр | Хүндрэлийн түвшин | Эрэмбэтэй хавтгай жагсаалт |
| cognitive-frameworks (шинэ) | Танин мэдэхүйн бүтэц | Танин мэдэхүйн түвшин | parentId-тай мод |
| competencies | Чадамжийн бүтэц + хувилбар | Чадамж | parentId-тай мод |
| topics | Контекст сонголт | Сэдэв | Тухайн контекстийн мод |
| superadmin/assessment-contexts | Контекстүүд | Холбоос/бэлэн байдал, create/edit modal | Дөрвөн үндсэн лавлахыг холбоно |

Лавлах цэсэнд audience → difficulty → cognitive → competence → topics дарааллыг хэрэглэнэ. Контекстийн хуудас дутуу лавлах бүрийн admin editor руу шууд холбоостой байна. Буцаж ирэхэд draft болон өмнөх сонголтыг сэргээх, lookup-ийг refresh хийх боломжтой байна.

Дахин ашиглах UI: хоёр баганатай layout, хайлт, сонголт, count, toolbar, empty/error/skeleton, FormModal, focus trap/restore, dirty confirmation, MN/EN, responsive layout. Модны дүрслэлийг тусдаа adapter-тай ашиглаж болно; API/domain validation-ийг тусдаа service-д хадгална. Drag-and-drop-ийг хуучин topics/competencies-оос modal parent/order үйлдэл рүү нэг мөр болгох саналтай.

## 5. Талбар ба validation

### Difficulty

Scale: code, name, description, isActive. Level: difficultyScaleId, code, name, rank, numericValue, minAbility, maxAbility, color, reportOrder, description, icon, isActive.

Энэ нь parentId-гүй хавтгай хэмжүүр. rank нь scale дотроо unique; audience-ийн sibling orderIndex-тэй адил гэж үзэж болохгүй. rank солих/reorder нь unique constraint-ийг зөрчихгүй transaction-тай байх ёстой. Decimal nullable утгыг хоосон үед null, 0 үед 0 гэж хадгална. Decimal(10,4)-ийн precision/хязгаар, minAbility<=maxAbility, өнгөний зөвшөөрсөн формат, integer эрэмбийг шалгана. Тоон утгыг автоматаар IRT эсвэл онооны утга гэж тайлбарлахгүй; хэмжүүрийн бодлогыг админ тодорхойлно.

### Cognitive

Framework: code, name, frameworkVersion, description, isActive. Level: cognitiveFrameworkId, parentId, code, name, rank, description, icon, reportBucket, isActive.

parent нэг framework-д байна; self/descendant cycle хориглоно. Одоогийн unique rank нь sibling дотор биш бүх framework дотор үйлчилдэг. Эхний хувилбарт энэ дүрмийг хадгалж, шинэ rank-ийг framework-ийн max+1 болгоно. Хэрэв sibling order шаардлагатай бол тусдаа orderIndex болон constraint migration төлөвлөнө. Cognitive framework code schema-д globally unique; frameworkVersion-ийг competence-ийн code+version дүрэмтэй андуурахгүй.

### Competence

Framework: code, version, name, description, isActive, optional jurisdiction, ownerOrganizationId, externalStandardRef, validFrom/validTo. tenantId/owner-ийг хэрэглэгчийн дурын string-ээр эрхийн шалгалтгүй авахгүй. proficiencyScaleId нь одоогоор Prisma relation биш тул шинэ сонголт зохиож бөглөхгүй.

Type: competenceFrameworkId, parentId, code, name, description, orderIndex, icon, isActive. Code+version нь framework-ийн unique key; type code нь framework дотроо unique. parent нэг framework-д, cycle-гүй. Ашиглагдсан framework-ийн хувилбар/семантикийг дураар солихын оронд шинэ framework хувилбар үүсгэнэ.

### Topic

Контекстийг ил тод сонгоно. code, title, description, parentId, orderIndex, externalCode, validFrom/validTo, isActive хадгална. depth/path-ийг backend parent-аас тооцоолж, subtree шилжүүлэхэд бүх үр удмыг transaction-д шинэчилнэ. Өөр контекстийн parent хориглоно. Контекст хооронд ашиглагдсан сэдвийг зөөхгүй; шаардлагатай бол хяналттай хуулна.

Topic.assessmentContextId одоогоор String? бөгөөд Prisma relation/FK байхгүй. tenantId, assessmentContextId нь nullable тул compound unique нь null scope-ийн duplicate кодыг найдвартай хориглохгүй. Эхлээд orphan/duplicate/null аудит; дараа нь context FK, тодорхой scope-ийн unique constraint migration санал болгоно. Одоогийн 5 null-context сэдвийг админд «Контекстэд холбоогүй» жагсаалтаар харуулна. Эхний контекстэд автоматаар оноохгүй.

### Нийтлэг хамгаалалт

Typed DTO ба runtime validation; шинэ uppercase code, засахад immutable code; 400/404/409 тодорхой алдаа; nullable талбар цэвэрлэх боломж; parent validation+write Serializable transaction; serialization retry; хэрэглэгдсэн мөрийг устгахгүй, идэвхгүй болгох тайлбар. Scale/framework солих нь холбоотой classification-ийн утгыг өөрчилдөг тул child-ийг дурын root руу шилжүүлэх API нээхгүй.

GET filter-үүд: difficultyScaleId, cognitiveFrameworkId, competenceFrameworkId, assessmentContextId. Admin GET идэвхгүй мөрийг харуулна; authoring selector шинэ сонголтод идэвхтэй ба зөв scope-ийн мөрийг ашиглана. Өмнө холбогдсон идэвхгүй утгыг нууж алга болголгүй тэмдэглэж харуулна.

## 6. Контекстийн шинэ урсгал

1. Нэр, системийн код, идэвхтэй эсэх, шаардлагатай хугацаа.
2. Audience type → optional audience level (төрөл солиход хуучин level-ийг цэвэрлэх; backend same-type validation).
3. Difficulty scale → идэвхтэй түвшний тоо ба preview.
4. Cognitive framework → идэвхтэй түвшний тоо ба preview.
5. Competence framework/version → идэвхтэй competence-ийн тоо ба preview.
6. Хураангуй, дутуу тохиргоо, хадгалах.

Дөрвөн үндсэн FK-г заавал ил тод илгээнэ; backend findFirst fallback-ийг арилгана. Нэг lookup тасарвал бусад сонголтыг алдуулахгүй, алдаатай хэсэгт retry харуулна. 403, жинхэнэ хоосон лавлах, network failure ялгаатай байна.

Санал болгож буй derived readiness нь schema enum нэмэхгүй: missingReferences, inactiveReferences, emptyDifficultyLevels, emptyCognitiveLevels, emptyCompetences, optional noTopics. FK-ууд бүрэн боловч хүүхэд түвшин дутуу context-ийг зөвхөн идэвхгүй тохиргоо болгон хадгалж болно. Идэвхжүүлэхэд дөрвөн лавлах хүчинтэй, шаардлагатай хүүхдүүд бэлэн байх дүрэм санал болгоно. Topic байхгүйг context үүсгэхэд хориглохгүй; асуулт ангилал хийхэд шаардлагатай гэж харуулна. Ийм readiness нь одоо байгаа бодлого биш, хэрэгжүүлэх шинэ шалгуур.

Холбоотой classifications/templates/revisions/audienceRules байвал context-ийн үндсэн framework FK-уудыг шууд өөрчлөхөөс хамгаална. Шинэ context үүсгэж дараагийн ажлыг түүн рүү чиглүүлэх нь тайлан/түүхийн утгыг хамгаална.

## 7. Асуулт ба quiz урсгалд хийх зайлшгүй өөрчлөлт

Бэлэн лавлах CRUD дангаараа бүрэн шийдэл биш. Асуулт хадгалах DTO-д assessmentContextId-ийг ил тод шаардаж, DEFAULT/dynamic context болон эхний level fallback-уудыг арилгана (хуучин client-ийн compatibility-г тусад нь шалгана).

Backend шалгалт: topic зөв context/global бодлоготой; difficultyLevel зөв scale-д; cognitiveLevels зөв framework-д; competencies зөв competence framework-д; audienceLevel зөв type-д; шинэ ангилалд идэвхгүй утга орохгүй. Weight-ийн хүрээ/нийлбэрийн дүрмийг домэйн бодлоготой нэг мөр болгоно. Хуучин classification-ийг солих delete/create бүхэлдээ transaction-д байж validation алдаанд өмнөх өгөгдөл алдагдахгүйг integration тестээр батална.

Quiz section, template, revision болон audience rule-ийн lookup/filter/validation мөн ижил context-ийг дагах ёстой. Нэг framework-ийн code өөр framework-д давтагдах нь зөв байж болох тул code-оор глобал хайж эхний мөрийг авахгүй.

## 8. Одоо хэрэгтэй ба дараагийн өргөтгөл

Одоогийн context үүсгэхэд шинэ domain table зайлшгүй шаардлагагүй: байгаа дөрвөн үндсэн лавлах, тэдгээрийн хүүхдүүдийн CRUD ба өгөгдлийг бүрэн болгоно.

AssessmentContext дахь curriculumId, subjectId, occupationId, organizationTypeId, regionId, reportingDimensionSetId болон CompetenceFramework.proficiencyScaleId нь энэ assessment schema-д FK relation-гүй scalar талбарууд. Ижил нэртэй model-ууд шалгасан services-ийн Prisma schema-д олдоогүй. Эдгээрийг сонголтын лавлах гэж UI-д нэмж оруулахын өмнө аль service эзэмших, global/tenant scope, code/version, lifecycle, хэрэглээ, cross-service validation-ийг тогтооно. Бүх nullable string-д автоматаар шинэ хүснэгт үүсгэхийг зөвлөхгүй.

Эхний хувилбар: үндсэн дөрвөн лавлах + topic + context. Дараагийн тусдаа ажил: curriculum/subject, occupation, organisation/region integration, reporting/proficiency хэрэгцээгээр нарийвчлах.

## 9. Өгөгдөл бүрдүүлэх ба хэрэгжилтийн дараалал

1. Одоогийн snapshot/backup; duplicate, orphan, inactive, empty framework аудит. Өмнөх хэрэглэгчийн өөрчлөлтүүдийг хадгална.
2. Shared editor primitives, DTO/error/transaction helpers; cognitive framework CRUD+цэсийг эхэлж нэмнэ.
3. Difficulty болон competence CRUD-ийн хадгалалт/validation, дараа topic-ийн schema/data integrity засвар.
4. Context editor, dependent selector, readiness, audienceLevel дэмжлэг.
5. Question/quiz ангиллын context-scoped validation; implicit fallback-уудыг арилгах.
6. Тусгаарласан өгөгдлөөр unit/integration/browser/visual, lower-role authorization, refresh persistence, concurrency ба устгалтын хамгаалалт шалгах.
7. Бодит reference content-ийн нэр, code, version, утга, эрэмбийг админ баталгаажуулж preview/import хийнэ. Idempotent key-ээр давхардуулалгүй, existing мөрийг автоматаар overwrite хийхгүй. Standard жишээг production-д шууд seed хийхгүй.
8. Түвшингүй DIFF_5_LEVEL-ийг бодлогоор нь бүрдүүлэх эсвэл идэвхгүй болгох; BLOOM competence-ийн зориулалтыг нягтлах; cognitive framework ба хүүхдүүдийг бүрдүүлэх; context үүсгэх; 5 topic-ийг сонгосон context-д хяналттай холбох.
9. Production backup/image rollback → шаардлагатай reviewed migration → assessment API → portal deploy. Зөвшөөрсөн бодит өгөгдлөөр нэг context, question classification, quiz template урсгалын smoke. Автомат DB restore/устгалтгүй.

## 10. Дууссан гэж үзэх шалгуур

SUPER_ADMIN бүх үндсэн лавлах, хүүхэд түвшин, контекстийг UI-аас бүрэн үүсгэж/засаж/идэвхгүй болгож чадна; бүх талбар refresh-ийн дараа хадгалагдана. Хоосон эсвэл буруу хүрээний лавлахаар ашиглах боломжгүй контекстийг идэвхжүүлэхгүй. Асуулт/quiz зөвхөн өөрийн контекстийн ангиллаар хадгалагдана. Ашиглагдсан мөрийн устгалт, цикл, scope солилт өгөгдөл эвдэхгүй. Production жишээ seedгүй, existing өгөгдөл хадгалагдсан, буцаалт бэлэн байна.
