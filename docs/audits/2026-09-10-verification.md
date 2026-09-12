# Production бэлтгэлийн шалгалт — 2026-09-10

## Хамрах хүрээ

Энэ нь тусгаарласан `seek-verify` орчны үр дүн. Production байршуулалт хийгдээгүй. `infra-npm`, нийтийн DNS/сертификат болон бусад платформыг өөрчлөөгүй. Нууц агуулж болзошгүй дэлгэрэнгүй логийг Git-д орохгүй `.production/evidence/` дотор хадгалсан.

## Батлагдсан үр дүн

| Шалгалт | Үр дүн | Локаль нотолгоо |
|---|---|---|
| Frozen dependencies, backend, хоёр frontend production build | Амжилттай | `build-dependencies.log`, `build-backend.log`, `build-portal-web.log`, `build-assessment-web.log` |
| Эцсийн image startup, зургаан migration job | Бүх migration exit 0; ажиллаж буй үйлчилгээний health давсан | `final-start.log`, `final-runtime.log` |
| Compose шаардлага | 2 тест; нууц тус бүрийг орхиход fail-closed, зөвхөн 4 ingress proxy_net-д холбогдох тодорхойлолт | `compose-tests.log` |
| Runtime тусгаарлалт | Verification container-ууд host port, proxy_net холболтгүй | `final-runtime.log` |
| Зорилтот automated tests | Auth 25, gateway 31, execution 21, file 9, integration 5 — нийт 91 | `targeted-tests.log` |
| API smoke, эцсийн image | Бүртгэл, Mailpit баталгаажуулалт, login/cookie, profile/catalog, CSRF, authoring/mock denial, signed upload/download, cross-user denial, эвдсэн signature rejection | `final-infrastructure-smoke.log` |
| Chromium, эцсийн image | Бүртгэлийн UI → email link → нэвтрэлт → Secure/HttpOnly cookie → catalog; payments 404 | `final-browser-smoke.log` |
| Өгөгдөл хадгалсан migration | Legacy question type/feedback, outbox status/eventId хадгалагдсан | Migration fixture болон өмнөх шалгалт; `restored-data.log` |
| Локаль сэргээх | SQL болон MinIO/Redis/RabbitMQ archive шинэ тусгаарласан volume-д сэргэсэн | `restore-check.log` |
| Файлын агуулга сэргээх | MinIO sentinel объект анхны байтуудтай ижил | `restored-object.log` |

Өмнөх шатанд monorepo typecheck 25/25 task, turbo test 50/50 task болон portal-ийн 4 component test давсан. Эдгээрийн анхны `/tmp` лог серверийн завсарлагын дараа хадгалагдаагүй; 50 task нь 50 unit test гэсэн үг биш. Дээрх 91 тестийн шинэ лог хадгалагдсан.

RabbitMQ restart-ийн үед worker дахин асаж consumer subscription сэргэсэн. Энэ ажиглалт submit/outbox-ийн durable delivery, exactly-once боловсруулалтыг батлахгүй.

## Шалгалтын хязгаар

- Browser нь тусгаарласан nginx болон өөрөө гарын үсэг зурсан сертификат ашигласан; зөвхөн тестэд certificate error-ийг зөвшөөрсөн. Нийтийн HTTPS, бодит NPM, DNS батлагдаагүй.
- SMTP нь Mailpit. Бодит SMTP хүргэлт батлагдаагүй.
- Үнэлгээ үүсгэх → өгөх → autosave → submit → үр дүн урсгал **даваагүй**: бодит attempt хэрэгжүүлэлт дутуу тул production demo зам зориуд 503.
- Tenant authorization бүрэн аудит, бүх модульд dynamic E2E, ачаалал, хугацаа дууссан signed URL-ийн шалгалт хийгдээгүй. Эвдсэн signature rejection нь хугацаа дуусах тестийг орлохгүй.
- Remote S3/restic encrypted backup, 14 хоногийн retention, timer ажиллагаа болон remote restore хийгдээгүй. Redis/RabbitMQ archive задарсныг шалгасан; сэргэсэн үйлчилгээний семантик ажиллагааг батлаагүй.
- Portal lint 80 error/25 warning; dependency audit 2 critical/18 high/23 moderate/4 low үлдсэн. Build амжилттай болсон нь эдгээрийг хаахгүй.

## Үлдсэн шаардлага

[Аудит](2026-09-10-production-deployment.md)-ын P0 асуудлыг шийдэж, бодит lifecycle болон tenant isolation тестийг давуулах шаардлагатай. SMTP/NPM/backup хамгаалалттай тохиргооны зам, анхны админы email ирсний дараа [runbook](../runbooks/production-external-npm.md)-ийн гадаад тохиргоо ба release алхмуудыг гүйцэтгэнэ.
