# Token Lifecycle

Access болон Refresh токений ажиллах горим, аюулгүй байдал.

## Access Token (JWT)

- **IMPLEMENTED**: Богино хугацаатай (15 минут) хүчинтэй байна.
- **IMPLEMENTED (Symmetric Strategy)**: Гарын үсэг зурахад symmetric (HS256) нууц түлхүүр ашиглаж байна. Хөгжүүлэлтийн placeholder нууц түлхүүрийг production орчинд ашиглахыг хаасан.
- **IMPLEMENTED (Claims Validation)**: JWT payload нь `sub` (User ID), `session_id`, `iss`, `aud`, `jti`, `iat`, `exp` claims-ийг агуулж байна. Gateway нь эдгээр claims-ийг тус бүр баталгаажуулна.
- **IMPLEMENTED (In-Memory)**: Хөтөч зөвхөн in-memory санах ойд хадгалах ба `localStorage` болон `sessionStorage` руу хэзээ ч бичихгүй.
- **FUTURE_HARDENING**: Asymmetric (RS256/ES256) түлхүүрийн хослол руу шилжих, JWT-г Gateway түвшинд шуурхай цуцлах (instant revocation) механизм нэмэх.

## Refresh Token (Opaque String)

- **IMPLEMENTED**: Урт хугацаатай (7 хоног) хүчинтэй байна.
- **IMPLEMENTED (Hashed Storage)**: Өгөгдлийн санд зөвхөн SHA-256 hash хэлбэрээр хадгалагдана. Түүхий token хэзээ ч хадгалагдахгүй.
- **IMPLEMENTED (HttpOnly Cookie)**: Хөтөчид зөвхөн `HttpOnly`, `SameSite=lax` (эсвэл strict/none), `Secure` cookie-ээр дамжуулна. Cookie-г цэвэрлэхдээ үүсгэсэн атрибутуудтай ижил атрибут ашиглан устгана.
- **IMPLEMENTED (Rotation)**: Access токен шинэчлэх (refresh) бүрт хуучин токенийг `rotatedAt` болгож, шинэ refresh токен олгоно. Энэ урсгал нь Prisma `$transaction` дотор atomic хэрэгжсэн.
- **IMPLEMENTED (Session as Token Family)**: Тусдаа бие даасан `token_family_id` байхгүй бөгөөд сесс өөрөө (`SESSION_AS_TOKEN_FAMILY`) refresh token family-ийн үүргийг гүйцэтгэнэ.
- **IMPLEMENTED (Reuse Detection)**: Хуучин/эргэлтэд орсон токенийг дахин ашиглах оролдлого илэрвэл уг сессийн БҮХ refresh токенуудыг хүчингүй болгож (`revokedAt` огноо оруулах), сессийг цуцална.
