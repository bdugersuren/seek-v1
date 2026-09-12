# ASSESSOR контекстийн эрх — production гаргалт

2026-09-12. Хэрэглэгч SUPER_ADMIN-аас тухайн ASSESSOR-д контекст оноох хувилбарыг зөвшөөрсөн.

## Хэрэгжилт

- AssessorContextGrant model ба additive migration, unique contextId/userId, контексттэй FK, assignedBy/createdAt.
- SUPER_ADMIN context editor-д идэвхтэй ASSESSOR-ийг сонгож оноох/цуцлах удирдлага. Target account-ийг auth service-ээр батална.
- Gateway-ийн нарийн route allowlist; assessment guard нь role, идэвхтэй context grant, owner, nested references-ийг шалгана. Metadata/list хариуг зөвшөөрөгдсөн ID-аар шүүнэ.
- Асуулт, blueprint, quiz өөрийн эзэмшил болон оноосон context-ийн хүрээнд CRUD; owner/creator/workflow actor-ийг сервер тогтооно. Клиентийн ownerUserId шүүлтүүрээр эрх тойрохгүй.
- Асуултын зөв context/topic/difficulty/cognitive/competence холбоосыг validation хийнэ. Батлуулах хүсэлт/resubmission боломжтой; батлах/нийтлэх, админы лавлах mutation, өөрийн эрхийг өөрчлөх боломжгүй.
- Context pages-ийн mock-assessor filter арилсан; question list context filter нэмсэн. Quiz revision context blueprint-ээс авна; quiz create/update commit-ийн дараа хариуг уншина.
- ASSESSOR цэснээс боломжгүй админы лавлах болон DB editor холбоосуудыг нуусан. Error/empty/retry төлөв хэвээр.

## Баталгаажуулалт

- Backend/portal/gateway typecheck болон production builds амжилттай.
- Gateway: 29 тест. Compose: 2 тест. Preflight амжилттай.
- Verification migration амжилттай.
- Бодит gateway/API ба PostgreSQL: grant/upsert/revoke, context isolation, direct ID denial, client identity spoofing, inactive context, metadata mutation denial, question/blueprint/quiz draft CRUD, submit-only workflow — давсан.
- Chromium: admin assignment/revocation → ASSESSOR контекст сонгох/dashboard, цуцалсны дараах хоосон жагсаалт, боломжгүй admin links нуугдах — давсан. Screenshot нягталсан.
- Тестийн fixture зөвхөн verification-д, цэвэрлэсэн. Production test user, metadata эсвэл automatic grant үүсгээгүй.

## Гаргалт

Private DB/image/config backup хадгалж, pg_restore --list шалгасан. Migration → assessment → gateway → portal дарааллаар зөвхөн шаардлагатай service-үүдийг шинэчилсэн.

14 сервис healthy. Дахин үүссэн: assessment, gateway, portal-web. Бусад runtime ID өөрчлөгдөөгүй.

Одоогийн өгөгдлийн тоо хэвээр: контекст 1, асуулт 0, blueprint 0, quiz 0, audience type 4, audience level 21. Шинэ оноолт 0 — бодит хэрэглэгчид админ UI-аас онооно.

LAN-аас TLS verification-тэй HTTPS: assessor/context 307, admin context page 307 (нэвтрээгүй), context API 401 (нэвтрээгүй), gateway readiness 200. Production credential байхгүй тул authenticated CRUD-ийг production-д хийгээгүй; яг гаргасан image-үүдээр verification-д баталсан.

- `/seek-portal-web-1`: `sha256:410b3e529bef51adb4a2162c3e329bbee1040b69cb702ee31c75d618383bb0fa`
- `/seek-assessment-1`: `sha256:c0116e64da68ecf9dd55f714e939070069f0db1f2aa8831e738a0a19ce498614`
- `/seek-gateway-1`: `sha256:c0116e64da68ecf9dd55f714e939070069f0db1f2aa8831e738a0a19ce498614`

Private evidence: `.production/evidence/context-access/`. Ашиглах/буцаах заавар: [runbook](../runbooks/assessor-context-access.md).

Хүрээний хязгаар: shared/legacy ownership transfer, schedule publication/execution болон өмнөх production-readiness аудитын бусад ажлыг энэ гаргалтаар хаагаагүй. Шинэ grants хүснэгтийг rollback үед устгахгүй.
