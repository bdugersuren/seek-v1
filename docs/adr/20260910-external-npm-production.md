# ADR: External NPM болон тусдаа production Compose

Төлөв: Хэрэглэгчийн 2026-09-10 зөвшөөрсөн төлөвлөгөөний дагуу хэрэгжүүлэв.

Сервер дээр infra-npm аль хэдийн proxy_net-д ажиллаж байгаа тул SEEK өөр NPM болон 80/443 host port үүсгэхгүй. Standalone production Compose нь seek_backend bridge ашиглаж, зөвхөн portal-web, assessment-web, gateway, MinIO-г proxy_net-д нэмнэ. Backend egress нь SMTP/HTTPS-д шаардлагатай тул backend bridge internal:true биш.

Production startup нь build-time generated Prisma client ашиглана. Migration нь тусдаа one-shot job, app startup түүнээс хамаарна. Node 22/pnpm 9.5.0/frozen lockfile; backend-үүд нэг shared image-ээс тусдаа процессоор ажиллана. Runtime image-ийн dev tooling-ийг цааш багасгана.

Үр дагавар: өөр үйлчилгээний DNS alias/port-той зөрчилдөхгүй; хувийн DB/cache/queue-д proxy_net-аас шууд хүрэхгүй. Standalone prod файлыг хуучин base/dev overlay-той нийлүүлэхгүй. 20,000+ concurrency/HA баталгаа энэ single-host deployment-д хамаарахгүй.

Public rollout нь аудитын release blockers, бодит HTTPS/E2E болон backup restore gate-ийг давсны дараа хийгдэнэ.
