# Active Task: Portal Web Auth Pages and Service Integration

## 1. Task Interpretation / Зорилго
`apps/portal-web` (portal.seek.mn) дээр одоогоор хэрэгжиж буй mock авторизацийн логикийг унтрааж, `gateway` болон `auth` үйлчилгээнүүдээр дамжуулан бодит JWT болон HTTP-only Cookie (`refresh_token`) ашигласан бодит нэвтрэх, бүртгүүлэх, сесси сэргээх, гарах урсгалыг бүрэн тохируулж холбоно. Үүний тулд одоогийн dummy UI бүхий `register`, `forgot-password` хуудсуудыг бодит form-ууд болон validation-оор тоноглож, API-тай холбоно. Мөн API-ийг турших бэлэн Postman файлуудыг үүсгэнэ.

---

## 2. Scope & Non-Goals / Хамрах хүрээ ба Хамрахгүй зүйлс

### Scope (Хамрах хүрээ):
- **Database & Services**: `auth_db`-д хөгжүүлэлтийн DB migration хийж, seed хэрэглэгчдийг оруулах.
- **Toggle switch**: `NEXT_PUBLIC_ENABLE_MOCK_AUTH=false` тохируулгаар бодит горимыг идэвхжүүлэх.
- **Frontend Pages Integration**:
  1. **Login Page (`(auth)/login`)**: Бодит имэйл/утасны дугаар болон нууц үгээр нэвтрэх form-ийг `/api/v1/auth/login` руу холбох.
  2. **Register Page (`(auth)/register`)**: Нэр, Имэйл, Утасны дугаар (`phoneNumber`), Нууц үг, Нууц үг давтах талбаруудтай бүртгэлийн form угсарч, `/api/v1/auth/register` руу холбох.
  3. **Forgot Password Page (`(auth)/forgot-password`)**: Утас эсвэл имэйл оруулах талбартай, OTP код илгээх хүсэлт явуулдаг form-ийг `/api/v1/auth/forgot-password` руу холбох.
  4. **Reset Password Page (`(auth)/reset-password` — ШИНЭЭР ҮҮСГЭХ)**: OTP код болон шинэ нууц үгээ оруулан шинэчилдэг хуудсыг үүсгэж `/api/v1/auth/reset-password` руу холбох.
- **Session Management**: Access token-ийг in-memory-д, Refresh token-ийг HTTP-only cookie-д хадгалж, хуудас ачаалагдах бүрт (`auth-bootstrap.tsx`) сессийг сэргээдет болгох.
- **Route Guards & Middleware**: Нэвтрээгүй хэрэглэгчийг хамгаалалттай хуудсуудад хандах үед автоматаар `/login` руу чиглүүлэх Next.js Client-side redirect болон `middleware.ts` тохируулах.
- **Testing Assets**: Postman-оор API-г шууд шалгах боломжтой Collection JSON болон Environment тохиргооны файлуудыг үүсгэх.

### Non-Goals (Хамрахгүй зүйлс):
- SMS/SMTP gateway-тэй шууд холболт хийх (хөгжүүлэлтийн шатанд SMS OTP илгээлтийг mock хэлбэрээр үлдээнэ).

---

## 3. Detailed Execution Plan / Хэрэгжүүлэх нарийвчилсан төлөвлөгөө

### Алхам 1: Database Setup & Service Check
1. `services/auth` дотор `npx prisma migrate dev` болон `npx prisma db seed` ажиллуулж, `tester@seek.local` болон бусад тестийн хэрэглэгчдийг DB-д бэлдэх.

### Алхам 2: UI Pages Assembly & Connection
1. **Бүртгүүлэх хуудас (`(auth)/register/page.tsx`)**:
   - `name`, `email`, `phoneNumber`, `password`, `confirmPassword` талбар бүхий form үүсгэх.
   - Client-side validation тохируулж, `/api/v1/auth/register` руу холбох.
2. **Нууц үг сэргээх хуудас (`(auth)/forgot-password/page.tsx`)**:
   - Имэйл/утас оруулах form угсарч, `/api/v1/auth/forgot-password` рүү холбох.
3. **Нууц үг шинэчлэх хуудас (`(auth)/reset-password/page.tsx` — ШИНЭЭР ҮҮСГЭХ)**:
   - OTP код, Шинэ нууц үг оруулах талбаруудтай form үүсгэж `/api/v1/auth/reset-password` API руу холбох.
4. **Нэвтрэх хуудас (`(auth)/login/page.tsx`)**:
   - Хөгжүүлэлтийн mock панелаас гадна бодит API руу зөв fetch хийж буйг баталгаажуулах.

### Алхам 3: Session & Refresh Token Integration
1. `apps/portal-web/src/components/auth-bootstrap.tsx` дээр `mock` унтарсан үед `/api/v1/auth/refresh` болон `/api/v1/auth/me` замуудаар сессийг сэргээж, Redux-ийг шинэчилдэг логикийг бататгах.
2. Logout үйлдлийг бодитоор `/api/v1/auth/logout` дуудаж, cookie болон in-memory token-ийг цэвэрлэдэг болгох.

### Алхам 4: Middleware / Protection
1. `apps/portal-web/src/middleware.ts` файл шинээр үүсгэнэ.
2. Хамгаалалттай замууд руу нэвтрээгүй хэрэглэгч хандах үед cookie дотор `refresh_token` байхгүй бол шууд `/login` руу redirect хийх логикийг бичнэ.

### Алхам 5: Postman Assets Creation
1. `docs/api/seek_auth_collection.json` файлыг Postman Collection v2.1 форматаар үүсгэх.
2. `docs/api/seek_auth_environment.json` файлыг Postman Environment (local, staging хувьсагчидтай) форматаар үүсгэх.

---

## 4. Affected Applications & Services / Нөлөөлөх сервисийн жагсаалт
- **`apps/portal-web`** - Бүх auth хуудаснууд, auth bootstrap, redux store, middleware, routing.
- **`services/auth`** - DB, register, login, refresh, logout, forgot-password, reset-password API замууд.
- **`services/gateway`** - CORS, CSRF болон proxy чиглүүлэлтүүд.

---

## 5. Proposed Files and Folders / Өөрчлөх, үүсгэх файлууд
- `[MODIFY]` [apps/portal-web/src/components/auth-bootstrap.tsx](file:///home/bd/seek-v1/apps/portal-web/src/components/auth-bootstrap.tsx)
- `[MODIFY]` [apps/portal-web/src/app/(auth)/login/page.tsx](file:///home/bd/seek-v1/apps/portal-web/src/app/(auth)/login/page.tsx)
- `[MODIFY]` [apps/portal-web/src/app/(auth)/register/page.tsx](file:///home/bd/seek-v1/apps/portal-web/src/app/(auth)/register/page.tsx)
- `[MODIFY]` [apps/portal-web/src/app/(auth)/forgot-password/page.tsx](file:///home/bd/seek-v1/apps/portal-web/src/app/(auth)/forgot-password/page.tsx)
- `[NEW]` [apps/portal-web/src/app/(auth)/reset-password/page.tsx](file:///home/bd/seek-v1/apps/portal-web/src/app/(auth)/reset-password/page.tsx)
- `[NEW]` [apps/portal-web/src/middleware.ts](file:///home/bd/seek-v1/apps/portal-web/src/middleware.ts)
- `[NEW]` [docs/api/seek_auth_collection.json](file:///home/bd/seek-v1/docs/api/seek_auth_collection.json)
- `[NEW]` [docs/api/seek_auth_environment.json](file:///home/bd/seek-v1/docs/api/seek_auth_environment.json)
- `[MODIFY]` [docs/tasks/active-task.md](file:///home/bd/seek-v1/docs/tasks/active-task.md)

---

## 6. UI, API, Event, DB & Security Impact / Нөлөөлөх байдал
- **UI**: Бодит ажиллагаатай form-ууд, уян хатан алдааны мэдэгдлүүдтэй болно.
- **API**: Бүх auth API замууд хэвийн ажиллаж эхэлнэ.
- **Database**: Шинээр үүссэн хэрэглэгчид болон сессийн мэдээллүүд `auth_db`-д бичигдэнэ.
- **Security**: Next.js-ийн `middleware` түвшинд болон client-side түвшинд хандалтын хяналт давхар хамгаалагдана.

---

## 7. Options and Trade-offs / Хувилбарууд ба Сул талууд
- **Сонгосон арга зам (App Router Middleware)**:
  - *Давуу тал*: Server-side түвшинд нэвтрээгүй хэрэглэгчийг илрүүлж redirect хийх тул хамгаалалт хамгийн найдвартай ажиллана.
  - *Сул тал*: Static/API хүсэлтүүдийг үл тоомсорлож, зөвхөн page route-үүдийг зөв filter хийх тохиргоог middleware-д нарийн зааж өгөх шаардлагатай.

---

## 8. Test Plan / Тестлэх төлөвлөгөө
1. **Register test**: Шинэ имэйл, утас, нууц үгээр бүртгүүлж, амжилттай болсны дараа DB-д бичигдсэн эсэхийг шалгах.
2. **Login test**: Шинээр бүртгүүлсэн болон seed хэрэглэгчээр бодитоор нэвтрэх.
3. **Session refresh test**: Хуудсыг дахин ачаалахад (F5) хэрэглэгч системд нэвтэрсэн хэвээр байгааг баталгаажуулах.
4. **Forgot & Reset password test**: Нууц үг сэргээх, шинэчлэх алхмуудыг бодит API-тай холбон амжилттай дуусгах.
5. **Route guard test**: Хамгаалалттай зам руу (жишээ нь `/admin`) нэвтрээгүй үед шууд хандахад `/login` руу шилжиж байгааг шалгах.
6. **Postman verification**: Бэлдсэн collection болон environment ашиглан API тус бүрийг гараар дуудаж шалгах.

---

## 9. Rollback and Recovery Plan / Ухраах төлөвлөгөө
Хэрэв frontend холболтод асуудал үүсвэл:
1. `.env.local` дээр `NEXT_PUBLIC_ENABLE_MOCK_AUTH=true` болгож mock горимд буцаан шилжүүлнэ.
2. `git checkout` ашиглан өөрчилсөн хуудсуудыг хуучин scaffold байдалд нь оруулна.
