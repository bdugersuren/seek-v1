# Production байршуулалт — 2026-09-10

Хэрэглэгч production төлөвлөгөөг хэрэгжүүлэхийг зөвшөөрсөн.

- Standalone Compose, external proxy_net, тусдаа SEEK сүлжээ.
- Нууц/TLS/seed/build/migration/readiness засвар.
- Үндсэн үнэлгээний урсгал, тусгаарласан тест, backup/restore.
- Одоо байгаа бусад workload болон volume-д хүрэхгүй.
- SMTP/NPM/гадаад backup файлын зам, admin email хүлээгдэж байна.
- Буцаалт: өмнөх SEEK image/NPM тохиргоо; destructive DB reset хийхгүй.
