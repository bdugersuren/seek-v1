# seek.mn — Mock Data-оос Бодит API Холболтод Шилжих Чек Лист

Энэхүү файл нь платформын хөгжүүлэлтийн явцад ашигласан бүх mock дата болон холбогдох логикуудыг бүртгэх, бодит бэкэнд сервисүүдтэй холбож дуусах үед тэдгээрийг системээс бүрэн цэвэрлэхэд ашиглах хяналтын хуудас (checklist) юм.

---

## 1. Фронтенд Аппликэйшн дэх Mock Дата ба Логик (Frontend Mock Items)

### portal-web
- [ ] **Assessor Workspace Mock Data**
  - Файл: `apps/portal-web/src/features/assessor-workspace/mock-data.ts`
  - Тайлбар: Асуултын сан, blueprint, шалгалтын mock датанууд.
  - Бодит холболт: `apps/portal-web/src/features/assessor-workspace/api.ts` дээрх async API-ууд бүрэн ажиллах үед энэ файлыг устгана.
- [ ] **Assessor Workspace API - Synchronous Lookups**
  - Файл: `apps/portal-web/src/features/assessor-workspace/api.ts`
  - Мөр: `getQuestionById`, `getBlueprintById` зэрэг синхрон хайлтын функцүүд нь mock дата руу хандаж байна.
  - Шийдэл: Эдгээр хайлтуудыг бодит бэкэнд API-аас өгөгдөл авдаг async хэлбэрт шилжүүлэх.
- [ ] **Candidate Attempt Mock Data**
  - Файл: `apps/portal-web/src/features/candidate-attempt/mock-data.ts`
  - Тайлбар: Нэр дэвшигчийн шалгалтын оролдлогын mock дата.
- [ ] **Auth Mock Users & Role Enrichment**
  - Файл: `apps/portal-web/src/features/auth/mock-users.ts`
  - Тайлбар: Тест хэрэглэгчид болон тэдгээрийн үүрэг (roles)-ийг хуурамчаар үүсгэсэн логик.
  - Файл: `apps/portal-web/src/components/auth-bootstrap.tsx`
  - Тайлбар: `NEXT_PUBLIC_ENABLE_MOCK_AUTH !== "false"` үед mock хэрэглэгчээр шууд нэвтрүүлдэг хэсэг.

### assessment-web
- [ ] **Assessment Web Runtime Mock Data**
  - Файл: `apps/assessment-web/src/features/runtime/mock-data.ts`
  - Тайлбар: Шалгалт өгөх явцын mock өгөгдөл (`mockRuntimeAttempt`).
- [ ] **Runtime Adapter Logic**
  - Файл: `apps/assessment-web/src/features/runtime/adapter.ts`
  - Тайлбар: `isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === "true"` нөхцөл болон `mockRuntimeAdapter` объект.
  - Шийдэл: Бүрэн шилжсэний дараа зөвхөн `httpRuntimeAdapter`-ийг ашиглах ба mock хэсгийг устгах.

---

## 2. Бэкэнд Сервисүүд дэх Mock Дата ба Логик (Backend Mock Items)

### execution үйлчилгээ
- [ ] **Mock Question Creation**
  - Файл: `services/execution/src/execution.service.ts`
  - Арга (Method): `createMockQuestions()`
  - Тайлбар: Шалгалт эхлэхэд 3 ширхэг mock асуултыг хатуу кодоор үүсгэж буй логик.
  - Бодит холболт: Асуултуудыг `assessment` үйлчилгээнээс API-аар татах.
- [ ] **Supported Assessment List**
  - Файл: `services/execution/src/execution.service.ts`
  - Арга (Method): `getSupportedAssessment()`
  - Тайлбар: `data-analysis-basic`, `teamwork-skill`, `english-basic` зэрэг шалгалтуудыг mock байдлаар тодорхойлсон хэсэг.
  - Бодит холболт: Шалгалтын тохиргоог `assessment` үйлчилгээний API-аас авах.
- [ ] **In-Memory State Store & Event Publisher**
  - Файл: `services/execution/src/infrastructure/in-memory-state-store.ts`
  - Файл: `services/execution/src/infrastructure/in-memory-event-publisher.ts`
  - Тайлбар: Redis болон RabbitMQ байхгүй үед ажилладаг түр зуурын fallback mock логикууд. (Тестийн орчинд үлдэж болно, хөгжүүлэлтийн/үйлдвэрлэлийн кодоос салгах).

---

## 3. Тохиргооны Файлууд ба Орчны Хувьсагчууд (Config & Environment)

- [ ] **Assessment Web Local Configurations**
  - Файл: `apps/assessment-web/Dockerfile` ба `docker-compose.yml`
  - Хувьсагч: `NEXT_PUBLIC_MOCK_MODE=true` тохиргоог `false` болгох.
- [ ] **Portal Web Local Configurations**
  - Файл: `apps/portal-web/Dockerfile` ба `docker-compose.yml`
  - Хувьсагч: `NEXT_PUBLIC_ENABLE_MOCK_AUTH` тохиргоог `false` эсвэл бэкэнд рүү холбох.
- [ ] **Docker Compose Frontend Mock Profile**
  - Файл: `docker-compose.dev.yml` ба `README.md`
  - Тайлбар: `--profile frontend` ашиглах үед зөвхөн mock фронтенд асах горимыг өөрчилж, бэкэнд сервисүүдийг оролцуулах.

---

## 4. Шилжилтийн Үе Шатууд болон Чөлөөлөх Дараалал (Migration Steps)

1. **Бэкэнд Холболтыг Бэлдэх**: `execution` үйлчилгээ болон `assessment` үйлчилгээг хооронд нь холбож, бодит шалгалт болон асуултуудыг API-аар дамжуулах.
2. **Redis & RabbitMQ Идэвхжүүлэх**: Локал болон тест орчинд Redis, RabbitMQ-ийг бүрэн идэвхжүүлж, in-memory mock store-оос татгалзах.
3. **Фронтенд Адаптеруудыг Холбох**: Фронтенд дээр `MOCK_MODE=false` болгож, `httpRuntimeAdapter` болон `authFetch` бодит API-уудыг ажиллуулах.
4. **Mock Кодуудыг Устгах**: Дээрх цэвэрлэх жагсаалтад байгаа файлууд болон логикуудыг системээс бүрэн устгах.
5. **Туршилт Хийх**: Бүх mock дата цэвэрлэгдсэний дараа систем бодит API-аар бүрэн ажиллаж байгааг дахин шалгах.
