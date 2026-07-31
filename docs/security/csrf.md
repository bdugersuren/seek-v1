# CSRF and Cookie Security

CSRF (Cross-Site Request Forgery) халдлагаас сэргийлэх хамгаалалт.

## Cookie Тохиргоо (Cookie Attributes)

- **IMPLEMENTED (HttpOnly)**: JavaScript код ашиглан cookie-г уншиж хулгайлахаас сэргийлнэ (XSS mitigation).
- **IMPLEMENTED (Secure)**: Зөвхөн HTTPS сүлжээгээр cookie дамжуулна. Локал хөгжүүлэлтийн орчинд `AUTH_COOKIE_SECURE=false` (эсвэл хоосон) тохируулж ажиллах боломжтой. Production орчинд Secure байна.
- **IMPLEMENTED (SameSite)**: SameSite тохиргоо нь `lax` (default), `strict`, `none` байж болно.
- **IMPLEMENTED (Matching Deletion)**: Cookie-г цэвэрлэхдээ үүсгэсэн атрибутуудтай (HttpOnly, Secure, SameSite, Path) яг таарч устгана.

## Origin болон Referer баталгаажуулалт

- **IMPLEMENTED (Allowed Origins)**: Gateway `ProxyMiddleware` нь мутаци (`POST`, `PUT`, `DELETE`, `PATCH`) хийдэг хүсэлтүүдэд `Origin` болон `Referer` шалгадаг CSRF Origin validation хамгаалалт хэрэгжүүлсэн. Allowed origins нь `process.env.AUTH_ALLOWED_ORIGINS` (жишээлбэл, http://localhost:3000,http://localhost:3001,http://localhost:3002) жагсаалттай тулгагдана.
- **IMPLEMENTED (Disallowed Origins)**: Буруу/зөвшөөрөгдөөгүй origin-оос ирсэн mutation хүсэлтийг 403 Forbidden алдаагаар шууд зогсооно.
- **IMPLEMENTED (Non-mutating Bypass)**: `GET` зэрэг safe хүсэлтүүдийг шалгахгүйгээр шууд нэвтрүүлнэ.
- **IMPLEMENTED (Missing Headers Policy)**: Хөтөч бус (non-browser, mobile clients, curl, backend integration tests) эх сурвалжаас `Origin` болон `Referer` аль аль нь байхгүй ирсэн хүсэлтүүдийг хаахгүй нэвтрүүлнэ.
- **FUTURE_HARDENING**: Бүх мутаци хүсэлтэд double-submit cookie эсвэл CSRF Anti-Forgery token ашиглах нэмэлт хамгаалалт нэвтрүүлэх.
