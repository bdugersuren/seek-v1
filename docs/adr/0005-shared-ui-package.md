# ADR 0005: Shared UI Package Structure and Ownership

## Төлөв

`PROPOSED`

## Хамгаалалт

seek.mn платформын 2 frontend application-д (portal-web, assessment-web) хуваалцсан design system болон UI компонентуудыг нэгдсэн нэг `packages/ui` багцад төвлөрүүлнэ.

## Шийдвэр

- `@seek/ui` нэртэй хуваалцсан npm package үүсгэнэ.
- Сорс кодоос шууд Next.js програм руу transpile хийх хөгжүүлэлтийг хялбарчлахын тулд Next.js-ийн `transpilePackages: ["@seek/ui"]` боломжийг ашиглана.
- `react` болон `react-dom`-ийг package peer dependencies-д тодорхойлно.
