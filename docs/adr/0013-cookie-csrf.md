# ADR 0013: Browser Token Transport and CSRF Strategy

## Төлөв

`PROPOSED`

## Хамгаалалт

Refresh Token-ийг хөтөчийн localStorage-д хадгалахаас сэргийлж, XSS болон CSRF халдлагаас сэргийлэх найдвартай дамжуулалтын аргыг сонгоно.

## Шийдвэр

- Refresh Token-ийг хөтөчид хадгалуулахдаа `HttpOnly`, `Secure`, `SameSite=Lax` шинж чанартай Cookie ашиглан дамжуулна.
- Access Token-ийг JSON хариунд илгээж, хөтөч зөвхөн санах ойд (in-memory) хадгална.
- CSRF халдлагаас хамгаалахын тулд SameSite cookie тохируулгаас гадна Gateway дээр Origin/Referer толгой мэдээллийг шалгана.
