# Blueprint бүрэн урсгал — 2026-09-13

## Хэрэгжүүлсэн өөрчлөлт

Жагсаалт → ноорог үүсгэх → хоёр горимын сан → бэлэн эсэх → Quiz үүсгэх урсгал бодит API-тай ажиллана.

- `title/name` mapper нэгтгэж, код, сэдэв, хугацаа, босго, lifecycle, хэсгийн ID/тайлбар/дүрэм/тоо/оноог хадгалж буцаан уншдаг болсон.
- Update нь хэсгийг бүхэлд нь устгаж үүсгэхгүй. Optimistic version lock, ашиглагдсан хэсгийн FK хамгаалалттай; 409 үед editor бичсэн өөрчлөлтийг алдахгүй.
- Сонгосон болон дүрмийн сан зөвхөн эрхтэй, хүчинтэй нийтлэгдсэн хувилбаруудаас бүрдэнэ. Сэдвийн дэд мод, бодит difficulty, audience level, төрөл ашиглана.
- Давхцсан сангуудыг нийтэд нь шийдэх allocation нь эцсийн Quiz-д асуулт давхардуулахгүй. Ижил seed ижил сонголт гаргана; эхний N асуултыг тогтмол сонгодог ажиллагааг халсан.
- Create, revision, илэрхий draft reselection нэг resolver ашиглана. Сонгосон question/version ID, seed, дүрэм snapshot-д хадгалагдана. Энгийн засвар өмнөх сонголтыг өөрчлөхгүй.
- Бодит readiness, ашиглалт, огноо, хуудаслалт, facets; архивлах/сэргээх, устгах хамгаалалт, жинхэнэ хуулбарлах, preview болон холбогдсон Quiz-ийн асуултууд нэмэгдсэн.
- Ерөнхий болон контекстийн жагсаалт нэг компонент ашиглана. Mobile layout, native modal focus trap/Escape, ялгаатай API алдаа/retry төлөвтэй. Контекстийн Blueprint дээр зөв navigation мөр тодорно.
- Backend image-ийн хуучин Prisma client-ийг `dist/generated` дотор үлдээдэг copy алдааг зассан; release runtime schema-г тусад нь шалгана.

## Баталгаажуулалт

- 7 suite-ийн 55 unit/regression тест тэнцсэн.
- Assessment, gateway, portal typecheck болон хоёр production image build тэнцсэн.
- PostgreSQL: round-trip, concurrent 409, stable хэсэг, ашиглагдсан хэсгийн устгал хамгаалалт, давхцсан сан, published snapshot, илэрхий reselection, хуудаслалт, duplicate/delete шалгалт тэнцсэн.
- Эцсийн image дээр browser: хоёр горим, reload, Quiz create/reselect, 409 үед input хадгалалт, архивлах/сэргээх, хуулбарлах, API retry, контекст/эзэмшигч/actor хамгаалалт, malformed input 400 тэнцсэн.
- 375/768/1280/1440px card/table/editor overflow шалгалт тэнцсэн. Modal keyboard Tab, Escape, focus сэргэлт шалгасан. Screenshot-ийг харагдах байдлаар нягталсан; иж бүрэн WCAG аудит хийгээгүй.
- MATCHING болон MATRIX-ийн candidate/runtime browser ба PostgreSQL regression тэнцсэн.
- Нөөцөөс сэргээсэн production DB дээр шинэ migration амжилттай ажилласан. Production-д additive migration хийж зөвхөн assessment, gateway, portal-web image шинэчилсэн. Бүх 14 сервис healthy, бусад контейнерийн ID өөрчлөгдөөгүй.
- LAN HTTPS smoke: portal `/` 200, хамгаалалттай Blueprint 307, gateway readiness 200, хуучин runtime root-ийн redirect 307.

Нэвтрүүлсэн image: `seek-backend:blueprint-pools-release-20260913` (`edab888eca3e`), `seek-portal-web:blueprint-pools-release-20260913` (`73dbff596c72`). Нөөц: `.production/evidence/blueprint-pools/production-before-20260913-005313`. Exact image ID, build/test/deploy/smoke үр дүн `.production/evidence/blueprint-pools/` дотор хадгалагдсан.

Browser шалгалт нь зохиомол verification хэрэглэгч, контекст, асуулт ашиглаж, төгсгөлд өөрийн fixture-үүдийг цэвэрлэнэ. Production-д туршилтын өгөгдөл үүсгэхгүй.

## Screenshot

- [Жагсаалт 1440px](../../.production/evidence/blueprint-pools/screenshots/list-1440-card.png)
- [Хүснэгт 768px](../../.production/evidence/blueprint-pools/screenshots/list-768-table.png)
- [Жагсаалт 375px](../../.production/evidence/blueprint-pools/screenshots/list-375-card.png)
- [Editor 375px](../../.production/evidence/blueprint-pools/screenshots/editor-375.png)
- [Editor 1280px](../../.production/evidence/blueprint-pools/screenshots/editor-1280.png)
- [Бэлэн эсэх ба жишиг сонголт](../../.production/evidence/blueprint-pools/screenshots/preview.png)
- [Холбогдсон Quiz ба дахин сонголт](../../.production/evidence/blueprint-pools/screenshots/linked-quiz.png)
- [Зэрэг засварлах 409](../../.production/evidence/blueprint-pools/screenshots/conflict.png)

## Хязгаар ба ашиглалт

Runtime-д өмнө нь дэмжигдээгүй ORDERING, FILL_BLANK, LIKERT, SJT, CASE_BUNDLE төрлүүдийг энэ ажил runtime-д нэмээгүй; сонгох боломжгүй шалтгаан харуулна. Нэг Quiz revision-ийн бүрэлдэхүүн бүх оролцогчид ижил.

Жагсаалтын хариу серверээр хуудаслагдана. Readiness, facets тооцоолол одоогоор эрхтэй загваруудын catalog-ийг сервер дээр уншдаг; маш их өгөгдөлд SQL түвшний тусгай оновчлол дараагийн ажил байж болно.

[Ашиглалт, migration, буцаалтын заавар](../runbooks/blueprint-pools.md).

Дараагийн тусдаа ажлын санал: runtime-ийн үлдсэн таван төрлийг нэвтрүүлэх; их өгөгдөл дээр readiness/catalog SQL гүйцэтгэлийн хэмжилт, оновчлол хийх.
