# ADR 0008: Icon Abstraction Strategy

## Төлөв

`PROPOSED`

## Хамгаалалт

Аппликэйшнууд болон UI сан доторх icon library-н хамаарлыг нэг загварт оруулж, tree-shaking дэмжих.

## Шийдвэр

- Аппликэйшнууд нь `lucide-react`-ийг шууд импортлохгүй. ESLint `no-restricted-imports` дүрмээр үүнийг хориглоно.
- `@seek/ui` дотор нэгдсэн `Icon` abstraction үүсгэж, зөвхөн тэндээс шаардлагатай дүрсийг экспортолно.
- Tree-shaking-ийг дэмжихийн тулд бүх icon-ийг нэг дор bundle хийхгүй, шаардлагатайг нь л дуудаж ашиглана.
