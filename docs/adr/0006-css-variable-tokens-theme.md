# ADR 0006: CSS Variable Tokens and Theme Architecture

## Төлөв

`PROPOSED`

## Хамгаалалт

Платформын хэмжээнд дизайн систем болон theme өөрчлөлтийг нэгдсэн нэг стандартаар хөтөлнө.

## Шийдвэр

- Бүх дизайн токенууд `--seek-` гэсэн prefix бүхий CSS variables хэлбэрээр үүснэ.
- Semantic tokens болон Primitive tokens-ийг тодорхой зааглана.
- Theme switching (light, dark, system) нь HTML DOM дээрх `data-theme` attribute-оор тодорхойлогдоно (жишээ: `<html data-theme="dark">`).
- Hydration mismatch болон FOUC (Flash of Unstyled Content)-оос сэргийлэх blocking theme script-ийг Next.js-ийн `Document` эсвэл `RootLayout`-д байршуулна.
