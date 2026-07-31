# ADR 0009: Routing Convention and Shell Placement

## Төлөв

`PROPOSED`

## Хамгаалалт

Next.js App Router дээрх route collision-оос сэргийлж, хэрэглэгчийн чиглүүлэх замуудыг тодорхой болгох.

## Шийдвэр

- Route group нэрс URL үүсгэдэггүй тул Portal аппликэйшний route-уудыг `/login`, `/dashboard`, `/profile`, `/settings`, `/admin` байхаар зохион байгуулна.
- Route зөрчлөөс сэргийлж, dashboard-ийн хуудсуудыг `(portal)` route group доор байршуулна (жишээ: `(portal)/dashboard/page.tsx`).
- Assessment аппликэйшний landing хуудсыг `/assessment` root-д байршуулах бөгөөд `assessment/landing` гэх мэт илүүц URL үүсгэхгүй. Бусад хуудсыг `/assessment/session`, `/assessment/result`, `/assessment/completed` гэж зохион байгуулна.
- Одоо байгаа default `page.tsx` файлуудыг эдгээр shell-үүдэд чиглүүлж засна.
