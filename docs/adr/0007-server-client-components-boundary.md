# ADR 0007: Server and Client Component Boundary

## Төлөв

`PROPOSED`

## Хамгаалалт

Next.js App Router-ийн Server Components-ийн давуу талыг (хурдан ачаалалт, SEO) алдахгүй байх.

## Шийдвэр

- `@seek/ui` доторх бүх компонентууд дээр шууд `"use client"` заахгүй.
- Typography, layout blocks (Card, Stack, Grid, Divider, Surface, PageContainer, ContentContainer) зэрэг интерактив биш компонентууд нь Server-compatible байна.
- Зөвхөн hooks, state, window/document/local storage эсвэл event listener ашигладаг (Button, Input, Checkbox, Radio, Switch, ThemeProvider, ToastProvider) хэсгүүдэд `"use client"` ашиглана.
