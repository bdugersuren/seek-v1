# Танин мэдэхүйн бүтэц, түвшний удирдлага

SUPER_ADMIN → Лавлах → **Танин мэдэхүйн бүтэц**.
Хуудас: https://seek.mn/admin/metadata/cognitive-frameworks

1. **Шинэ бүтэц үүсгэх**: нэр, системийн код, тайлбар, бүтцийн хувилбар, идэвхтэй төлөвийг оруулна. Шинэ код A–Z, 0–9, `_`, `-` тэмдэгтэй; засахад өөрчлөхгүй.
2. Зүүн жагсаалтаас бүтцээ сонгоод **Үндсэн түвшин нэмэх** дарна.
3. Нэр, код, тайлбар, эрэмбэ, шаардлагатай бол тайлангийн бүлэг болон дүрсний код оруулна. Дүрсний код нь хадгалах metadata; дурын HTML/SVG дүрслэхгүй.
4. **Дэд түвшин нэмэх** нь тухайн мөрийг эцгээр сонгоно. Засах modal-аас өөр эцэг эсвэл үндсэн түвшин сонгож болно.
5. Эрэмбэ 0-ээс их буюу тэнцүү бүхэл тоо бөгөөд **бүх framework дотроо unique**. Шинэ түвшин хамгийн их эрэмбэ + 1 авна. Хоёр мөрийн эрэмбийг солих бол эхлээд сул эрэмбэ ашиглана.
6. Хүүхэдтэй/ангилалд хэрэглэгдсэн түвшин, түвшинтэй/контекстэд хэрэглэгдсэн бүтэц устахгүй. Идэвхгүй болгох боломжтой.
7. Үнэлгээний контекстийн хуудсыг шинэчлээд **Танин мэдэхүйн бүтэц (Bloom)** сонголтоос шинээр үүсгэсэн бүтцээ сонгоно. Бусад шаардлагатай лавлахыг мөн бүрдүүлсэн байх хэрэгтэй.

Шинэ framework/level автоматаар production-д seed хийгээгүй. Агуулга, нэр, хувилбарыг админ бодит шаардлагаар оруулна. ASSESSOR эрхийг өргөжүүлээгүй.

API: `/api/v1/assessment/questions/metadata/cognitive-frameworks`, `/cognitive-levels` — GET/POST, `/:id` PUT/DELETE. Level GET optional `cognitiveFrameworkId` filter-тэй; filterгүй хүсэлт хэвээр. Level create explicit cognitiveFrameworkId шаарддаг, эхний framework сонгох fallback байхгүй.

Validation: нэг framework-ийн эцэг, self/descendant cycle хориг, integer rank, immutable code/framework, unique code/rank. 400 буруу оролт, 404 байхгүй мөр, 409 давхардал/холбоостой устгалт. Parent validation/write Serializable transaction-д хийгдэнэ.

Schema migration шаардаагүй. Энэ гаргалт бусад context/question metadata fallback-ийн өргөн шинэчлэлийг хамрахгүй.

Буцаалт: `seek-backend:before-cognitive-20260911`, `seek-portal-web:before-cognitive-20260911` image-ийг `.env.production` дахь SEEK_ASSESSMENT_IMAGE, SEEK_PORTAL_IMAGE-д тохируулж зөвхөн assessment, portal-web-ийг --no-deps --no-build --pull never --wait ашиглан шинэчилнэ. Private backup: `.production/evidence/cognitive-release-backup/`. Өгөгдлийг автоматаар backup-аар дарж сэргээхгүй.
