# Active Task: Catalog Database Integration, Dynamic Button States & Layout Logout Fix

Status: `IN_PROGRESS`

## Goal
`https://portal.seek.mn/catalog` хуудсыг mock өгөгдлөөс салган, backend өгөгдлийн баазтай холбох. Шалгалтын хугацаа болон хэрэглэгчийн эрх/бүртгэлийн төлөвөөс хамаарч товчлууруудыг динамик болгох ("Шалгалт өгөх", "Худалдаж авах", "Хугацаа дууссан", "Эхлэх болоогүй"). Шалгалт эхлэхээс өмнө ерөнхий мэдээлэл болон дүрмийг агуулсан баталгаажуулах модал цонхыг `useDialog` ашиглан хэрэгжүүлэх. Мөн candidate layout дахь `handleLogout` үйлдлийг бодит JWT сесс цэвэрлэдэг болгон засах.

---

## Todo List

### Phase 1: Assessment Service Catalog API (Backend)
- [x] `services/assessment/src/catalog.controller.ts` шинэ контроллер үүсгэх.
- [x] `services/assessment/src/catalog.service.ts` шинэ сервис үүсгэх.
- [x] `services/assessment/src/app.module.ts` дотор шинэ модуль, контроллер, сервисийг бүртгэх.

### Phase 2: Gateway Verification
- [x] Gateway нь `/api/v1/assessment/*` хүсэлтүүдийг `assessment` үйлчилгээ рүү proxy хийж байгааг баталгаажуулах.

### Phase 3: Portal Frontend Catalog Integration
- [x] `apps/portal-web/src/features/catalog/api.ts` доторх `listCatalogAssessments` функцийг mock уншдаг байсныг өөрчилж, `/api/v1/assessment/catalog` руу ханддаг болгох.
- [x] `apps/portal-web/src/features/catalog/types.ts` доторх `CatalogAssessment` интерфэйст баазын төлөвтэй холбоотой шинэ талбаруудыг нэмэх.
- [x] `apps/portal-web/src/app/(candidate)/catalog/page.tsx` доторх товчлууруудыг шинэчлэх, "Худалдаж авах" дээр дарахад сагс руу шилжүүлэх, мэдээллийн модал цонхыг `useDialog` ашиглан нээдэг болгох.
- [x] `@seek/ui` сангийн `DialogProvider.tsx` файлын `description`-д ReactNode дамжуулах боломжтой болгох.

### Phase 4: Layout Logout Fix
- [/] `apps/portal-web/src/app/(candidate)/layout.tsx` доторх `handleLogout` функцийг бодит сессийг цэвэрлэж, API дууддаг болгон засах.

### Phase 5: Verification & Build
- [ ] Аппликейшнуудын build шалгах.
- [ ] Нэвтрэх, гарах болон каталогийг баазаас амжилттай уншиж буйг гараар шалгаж баталгаажуулах.
