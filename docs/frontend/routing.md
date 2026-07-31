# Routing Convention

Платформын маршрут (Routing) зохион байгуулалт ба route collision-оос сэргийлэх дүрэм.

## URL Бүтэц (Routing Table)

### 1. Portal Application (`apps/portal-web`)

Route group нэрс URL үүсгэдэггүй тул route collision-оос сэргийлж дараах байдлаар зохион байгуулав:

- `/login` : Нэвтрэх хуудас (`src/app/(auth)/login/page.tsx`)
- `/dashboard` : Хянах самбар (`src/app/(portal)/dashboard/page.tsx`)
- `/profile` : Хэрэглэгчийн мэдээлэл (`src/app/(portal)/profile/page.tsx`)
- `/settings` : Тохиргоо (`src/app/(portal)/settings/page.tsx`)
- `/admin` : Администратор хяналт (`src/app/(portal)/admin/page.tsx`)

_Тэмдэглэл: Root `/` хандалт нь автоматаар `/dashboard` руу чиглүүлэгдэнэ._

### 2. Assessment Application (`apps/assessment-web`)

- `/assessment` : Үнэлгээний landing хуудас (`src/app/assessment/page.tsx`)
- `/assessment/session` : Үнэлгээ өгөх идэвхтэй сесс (`src/app/assessment/session/page.tsx`)
- `/assessment/result` : Үнэлгээний дүн (`src/app/assessment/result/page.tsx`)
- `/assessment/completed` : Үнэлгээ дууссан төлөв (`src/app/assessment/completed/page.tsx`)

_Тэмдэглэл: Root `/` хандалт нь автоматаар `/assessment` руу чиглүүлэгдэнэ._
