# Active Task: Catalog Database Integration, Dynamic Button States & Confirmation Modal

Status: `IN_PROGRESS`

## Goal
`https://portal.seek.mn/catalog` хуудсыг mock өгөгдлөөс салган, backend өгөгдлийн баазтай холбох. Шалгалтын хугацаа болон хэрэглэгчийн эрх/бүртгэлийн төлөвөөс хамаарч товчлууруудыг динамик болгох ("Шалгалт өгөх", "Худалдаж авах", "Хугацаа дууссан", "Эхлэх болоогүй"). Шалгалт эхлэхээс өмнө ерөнхий мэдээлэл болон дүрмийг агуулсан баталгаажуулах модал цонхыг `useDialog` ашиглан хэрэгжүүлэх.

---

## Todo List

### Phase 1: Assessment Service Catalog API (Backend)
- [ ] `services/assessment/src/catalog.controller.ts` шинэ контроллер үүсгэх.
  - `GET /assessment/catalog` endpoint нэмэх.
  - `x-user-id` header-ээс нэвтэрсэн хэрэглэгчийн ID-ийг унших.
- [ ] `services/assessment/src/catalog.service.ts` шинэ сервис үүсгэх.
  - Нийтлэгдсэн (`status === 'OPEN'`) `QuizSchedule`-үүдийг татах.
  - Тухайн хэрэглэгчийн `QuizUserAssignment` элсэлт болон төлбөрийн төлөвийг хамт татах.
  - Идэвхтэй хугацаа болон оролцох эрхийг тооцон `CatalogAssessment` форматаар хөрвүүлж буцаах logic бичих.
- [ ] `services/assessment/src/app.module.ts` дотор шинэ модуль, контроллер, сервисийг бүртгэх.

### Phase 2: Gateway Verification
- [ ] `services/gateway/src/proxy.middleware.ts` нь `/api/v1/assessment/*` хүсэлтүүдийг `assessment` үйлчилгээ рүү proxy хийж байгааг баталгаажуулах (Нэмэлт өөрчлөлт шаардлагагүй бол шалгаж үзэх).

### Phase 3: Portal Frontend Catalog Integration
- [ ] `apps/portal-web/src/features/catalog/api.ts` доторх `listCatalogAssessments` функцийг mock уншдаг байсныг өөрчилж, `/api/v1/assessment/catalog` руу ханддаг болгох.
- [ ] `apps/portal-web/src/app/(candidate)/catalog/page.tsx` доторх `AssessmentNewCard` болон `AssessmentListItem` товчлууруудыг шинэчлэх:
  - `requiredAction` болон `allowed` төлөвт үндэслэн товчлуурын текст, загвар, disabled төлөвийг тохируулах.
  - "Худалдаж авах" дээр дарахад хэрэглэгчийг сагсны хуудас руу чиглүүлэх (урилга/сагслах logic-ийг зөв ажиллуулах).
  - "Шалгалт өгөх" дээр дарахад шууд ажиллах биш, харин модал цонх дуудах logic холбох.
- [ ] Шалгалт эхлэхээс өмнөх мэдээллийн Модал цонхыг `useDialog` ашиглан хэрэгжүүлэх.
  - Модал дотор шалгалтын үзүүлэлтүүд (хугацаа, асуултын тоо, оноо, дүрмийн заавар) харуулах.
  - Баталгаажуулсан тохиолдолд `createCatalogAttempt` дуудаж шалгалтын систем рүү чиглүүлэх.

### Phase 4: Verification & Build
- [ ] Аппликейшнуудыг build хийж шалгах (`portal-web`, `assessment` service).
- [ ] Каталогийн хуудасны товчлуурууд болон модал цонхны ажиллагааг гараар шалгаж баталгаажуулах.
