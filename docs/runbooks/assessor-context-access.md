# ASSESSOR-д контекст оноох

SUPER_ADMIN → Үнэлгээний контекст (`/superadmin/assessment-contexts`) → жагсаалтаас контекст сонгоно. Хуудасны доод талын **Контекстэд ажиллах ASSESSOR хэрэглэгчид** хэсэгт идэвхтэй ASSESSOR аккаунтыг имэйлээр нь сонгож **Эрх оноох** дарна.

Хэрэглэгч `/assessor/context` хуудсаа шинэчлэхэд зөвхөн өөрт оноосон идэвхтэй контекстүүд харагдана. Контекст дотроос асуулт, blueprint, quiz боловсруулна. Шинэ асуултад тухайн контекстийн сэдэв, хүндрэлийн болон танин мэдэхүйн түвшнийг сонгох шаардлагатай. Сэдэв контекстэд холбоогүй эсвэл лавлахууд дутуу бол админ эхлээд бүрдүүлнэ.

**Эрх цуцлах** нь дараагийн API хүсэлтээс хандалтыг хаана. Контекстийг идэвхгүй болгосон үед бүх ASSESSOR-ийн тухайн контекстийн хандалт зогсоно. Хэрэглэгчийн материал болон контекстийг устгахгүй. Контекстийг устгахаас өмнө оноолтуудыг цуцална.

## Эрхийн хүрээ

- ASSESSOR: оноосон контекст болон түүнд хамаарах лавлахыг уншина; өөрийн, зөвшөөрөгдсөн контекстэд ангилсан асуулт, өөрийн blueprint/quiz-д CRUD хийнэ.
- Өөр хэрэглэгчийн материал, оноогоогүй контекст, админы лавлах засвар, эрх оноох/цуцлах, батлах/нийтлэх үйлдэлд хандахгүй.
- Асуултын батлуулах хүсэлт болон дахин илгээх workflow зөвшөөрөгдөнө; сервер бодит хэрэглэгчийг actor болгон авна.
- SUPER_ADMIN: өмнөх удирдах боломжууд болон контекст оноох/цуцлах боломжтой.
- Оноолтгүй ASSESSOR контекстийн жагсаалтаас 200 + хоосон жагсаалт авна. Зөвшөөрөгдөөгүй контекст/объектыг ID-аар нээхэд 403 буцаана.
- Шинэ оноолт өөрөө материалын эзэмшигчийг солихгүй. Хуучин `mock-assessor`/`system_author` эзэмшилтэй материалыг автоматаар тухайн хэрэглэгчид шилжүүлэхгүй.

## Хэрэгжилт

`assessor_context_grant`: contextId + userId unique, assignedBy, createdAt; контексттэй FK холбоостой. Нэмэлт, өгөгдөл устгахгүй migration.

`/api/v1/assessment/context-access/:contextId`: GET оноолтын жагсаалт, POST `{userId}` оноох; DELETE `/:contextId/:userId` цуцлах. SUPER_ADMIN-only. Target user-ийг auth service-ийн идэвхтэй ASSESSOR аккаунт гэдгээр шалгана.

Gateway зөвхөн зөвшөөрсөн route-уудыг ASSESSOR-д дамжуулна. Assessment service оноолт, идэвхтэй контекст, материалын эзэмшил, nested question/reference холбоосыг давхар шалгана. Клиентийн ownerUserId/createdBy/actorUserId-д найдахгүй. Лавлахын mutation болон бусад endpoint default-deny байна.

Question list-ийн context filter ажиллана. Quiz revision контекстийг сонгосон blueprint-ээс авна. Quiz create/update хариуг transaction commit-ийн дараа уншина.

## Шалгалт ба гаргалт

Тусгаарласан `scripts/test-context-access.cjs` API болон Chromium-оор оноолт/цуцлалт, ID-гаар нэвтрэх оролдлого, owner spoofing, өөр контекстийн mapping, асуулт/blueprint/quiz CRUD, workflow, inactive context, admin UI → assessor dashboard урсгалыг шалгана. Нууц test credentials/DB URL stdin-ээр орно. Production-д fixture болон автомат оноолт үүсгэхгүй.

Production: backup → assessment migration → assessment → gateway → portal. Зөвхөн эдгээр app-уудыг --no-deps --no-build --pull never --wait ашиглан шинэчилнэ. Image-үүдийг SEEK_ASSESSMENT_IMAGE, SEEK_GATEWAY_IMAGE, SEEK_PORTAL_IMAGE тусдаа сонгоно.

Буцаалт: эхлээд gateway-ийг өмнөх image-д буцааж ASSESSOR хандалтыг хаана, дараа assessment болон portal-ийг буцаана. Нэмсэн хүснэгтийг болон хэрэглэгчийн өгөгдлийг устгахгүй. Private backup/image ID-ууд `.production/evidence/context-access/` дотор бий.


## Question drafts (2026-09-12)
The context question-bank modal creates an owned PRIVATE draft with explicit assessmentContextId before topic classification. Drafts can be saved without classification; approval requires a real topic and valid context levels. Do not work around missing topics by weakening the guard or seeding arbitrary topics. Use the supported cognitive-framework metadata endpoint in the editor, not database explorer. See docs/audits/2026-09-12-question-draft.md for rollout and evidence.
