# Зорилтот бүлэг, түвшний удирдлага

`https://seek.mn/admin/metadata/audience-types` хуудсыг SUPER_ADMIN ашиглана. ASSESSOR болон байгууллагын эрхийг энэ өөрчлөлтөөр өргөжүүлээгүй.

## Ашиглах дараалал

1. **Шинэ төрөл үүсгэх** дээр нэр, системийн код, шаардлагатай бол тайлбар оруулна. Шинэ код зөвхөн A–Z, 0–9, `_`, `-` тэмдэгтэй байна. Хадгалсны дараа кодыг өөрчлөхгүй.
2. Зүүн жагсаалтаас төрлөө сонгоод **Үндсэн түвшин нэмэх** дарна.
3. Шатлалын бүлэг бол GROUP, бодит анги бол GRADE_LEVEL, бусад түвшин бол LEVEL сонгоно.
4. Мөрийн **Дэд түвшин нэмэх** товч тухайн мөрийг эцгээр сонгоно. Засах цонхоор эцэг болон эрэмбийг өөрчилнө; үндсэн түвшин сонговол root болно.
5. Эрэмбэ нь 0-ээс их буюу тэнцүү бүхэл тоо. Ижил эцгийн хүүхдүүд эрэмбэ, дараа нь кодоор жагсана.
6. Хүүхэдтэй эсвэл контекст/quiz rule-д ашигласан мөрийг устгах боломжгүй. Шаардлагатай бол идэвхгүй болгоно. Админ идэвхгүй мөрийг бүдэг төлөвөөр харна.

Өмнөх null/хуучин levelKind болон системийн кодуудыг автоматаар шинэчлэхгүй. Production-д жишээ өгөгдөл нэмээгүй. Бодит зорилтот бүлэг, түвшний агуулгыг админ үүсгэнэ.

## API гэрээ

Одоо байгаа `/assessment/questions/metadata/audience-types` болон `audience-levels` endpoint-ууд хэвээр. Gateway public prefix: `/api/v1`.

- Type: `name`, `code`, `description`, `isActive`; GET нэмэлт `levelCount` буцаана.
- Level: `audienceTypeId`, `parentId`, `name`, `code`, `orderIndex`, `levelKind`, `externalCode`, `isActive`.
- `GET audience-levels?audienceTypeId=...` төрлөөр шүүнэ; filterгүй хүсэлт хэвээр.
- Хуучин `rank` оролтыг дэмжинэ; `orderIndex` давуу эрхтэй.
- 400: буруу оролт/цикл; 404: байхгүй мөр; 409: давхардсан код, холбоостой устгалт, зэрэг өөрчлөлтийн зөрчил.
- Parent validation ба өөрчлөлт Serializable transaction-д, serialization conflict үед хязгаартай retry хийнэ.

Schema-ийн шаардлагатай баганууд байсан тул migration нэмээгүй.

## Гаргалт, буцаалт

Assessment болон portal-ийн image-ийг `.env.production` дахь `SEEK_ASSESSMENT_IMAGE`, `SEEK_PORTAL_IMAGE`-ээр тусад нь сонгоно. Хоосон үед өмнөх SEEK_IMAGE_TAG fallback үйлчилнэ. Зөвхөн эдгээр хоёр сервисийг `--no-deps --no-build --pull never --wait` ашиглан assessment → portal дарааллаар шинэчилнэ.

Нөөц: `.production/evidence/audience-release-backup/` дотор private inspect/config болон `assessment.dump`. Эдгээр файл нууц агуулдаг; нийтлэхгүй. Буцаалтын tag-ууд: `seek-backend:before-audience-20260911`, `seek-portal-web:before-audience-20260911`. Буцаахад эдгээрийг эсвэл inspect-ийн өмнөх image ID-уудыг хоёр override variable-д тохируулж зөвхөн хоёр сервисийг дахин үүсгэнэ. Өгөгдлийг backup-аар автоматаар дарж сэргээхгүй.

## Тусгаарласан шалгалт

- `audience.service.spec.ts`: оролт, талбар хадгалалт, цикл/холбоос/алдаа, transaction retry.
- `scripts/test-audience-integration.cjs`: verification PostgreSQL CRUD ба зэрэг эсрэг parent update цикл үүсгэхгүйг шалгана. Зөвхөн verification connection, AUDIENCE_TEST_ENV=seek-verify тохиргоотой ажиллуулна.
- `scripts/smoke-audience-browser.cjs`: verification TLS address-ийг stdin `verificationAddress`-тай тулгаж, тусгаарласан хэрэглэгчийн email/password-оор UI CRUD шалгана. Production credential ашиглахгүй.
- Production-д demo fixture үүсгэхгүй. Бодит хэрэглэгчээр CRUD smoke хийхэд админы session шаардлагатай.
