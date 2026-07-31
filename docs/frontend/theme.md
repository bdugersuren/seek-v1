# Theme Architecture

Хэрэглэгчийн харагдах байдал, theme (light, dark, system) солих бүтэц.

## DOM Contract

Theme өөрчлөлтийг HTML DOM дээр дараах attribute-аар удирдана:

- `<html data-theme="light">`
- `<html data-theme="dark">`

Мөн Tailwind-ийн харанхуй горимтой зохицохын тулд `dark` class-ийг html tag-д нэмж/хасна.

## ThemeProvider & useTheme

- `ThemeProvider` нь хэрэглэгчийн сонголтыг `localStorage`-д хадгална.
- Хэрэв өмнөх сонголт байхгүй бол системийн preference (`prefers-color-scheme`) дагана.
- Hydration mismatch болон FOUC (Flash of Unstyled Content)-оос сэргийлэхийн тулд `localStorage`-оос унших логикийг hydration шатанд зөв шийдсэн.

## CSP & Security Implications

Хэрэв ирээдүйд hydration mismatch-оос бүрэн сэргийлэх зорилгоор inline blocking script ашиглах тохиолдолд CSP (Content Security Policy) `nonce` эсвэл `hash` тохируулах шаардлагатайг анхаарна уу.
