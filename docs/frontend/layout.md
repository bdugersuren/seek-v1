# Layout and Grid System

Хуудасны бүтэц, хуваарилалт болон responsive дизайны дүрэм.

## Layout Components

- **AppShell**: Програмын ерөнхий бүтэц (Header, Sidebar, Main Content, Footer) compose хийнэ.
- **PageContainer**: Хуудасны нэгдсэн хязгаарыг (`seek-container` class) тодорхойлно.
- **ContentContainer**: Хуудасны гол агуулгын хэсгийг тодорхойлно (max-w-4xl).

## Responsive Strategy

Манай дизайн систем нь дараах breakpoints-ийг дэмжинэ:

- `mobile` (default)
- `tablet` (`md`: min-width: 768px)
- `desktop` (`lg`: min-width: 1024px)
- `wide` (`xl`: min-width: 1280px)

Хөгжүүлэлтэд `Stack`, `Grid` болон CSS flex, grid helper классуудыг ашиглаж, responsive шийдлийг гаргана.
Жишээ нь: `Grid cols={3}` нь хэрэглэгчдэд responsive grid хэлбэрээр хүрнэ.
