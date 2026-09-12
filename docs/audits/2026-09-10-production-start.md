# SEEK production startup — 2026-09-10

## Үр дүн

Хэрэглэгчийн зөвшөөрлөөр SMTP тохиргоог шалгаж standalone production Compose-ийг
`seek` project-оор асаав. Нууц мэдээллийг тайлан/логт хэвлээгүй.

- 14 удаан ажиллах сервис healthy.
- auth/profile/organisation/assessment/execution/file migration: exit 0.
- Шинэ seek_postgres_data, seek_minio_data, seek_redis_data, seek_rabbitmq_data volume.
- Verification болон OJ өгөгдөл өөрчлөгдөөгүй, хуулагдаагүй.
- Дөрвөн ingress alias proxy_net-д холбогдсон; host port нэмээгүй.
- Нэмэлт NPM host өөрчлөлт шаардлагагүй байсан.

| Хаяг | NPM → upstream | LAN-аас TLS шалгалттай HTTPS |
|---|---|---|
| seek.mn | seek-portal-web:8081 | 200 |
| quiz.seek.mn | seek-assessment-web:8082 | 307 |
| quiz-api.seek.mn/health/ready | seek-gateway:3010 | 200 |
| files.seek.mn/minio/health/ready | seek-minio:9000 | 200 |

SMTP TLS/authentication host-оос амжилттай шалгасан; бодит захиа явуулаагүй тул
email хүргэлт, sender зөвшөөрөл, inbox/SPF/DKIM батлагдсан гэж үзэхгүй.

Эхний асалтад RabbitMQ ping health ногоон боловч execution AMQP connection
амжилтгүй болж restart хийсэн. Дараа нь холбогдон healthy болсон. Compose up --wait
дахин ажиллуулахад үлдсэн gateway/frontend асаж бүх stack healthy болсон.

## Давтан ажиллагаа

```bash
cd /home/exe/seek-v1
python3 scripts/preflight-production.py
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --no-build --pull never --wait --wait-timeout 180
```

Compose migration job дахин ажиллахдаа pending migration-уудыг хэрэгжүүлдэг.
Database reset/seed хийгээгүй. Нууцыг дахин үүсгэж солихгүй: persistent store дахь
credential-тай зөрчилдөнө.

## Хязгаар ба үлдсэн ажил

Infrastructure startup ба 502 засвар дууссан. Энэ нь assessment-ийн бүтэн lifecycle,
tenant authorization, runtime authentication болон dependency аудитын P0-г
шийдсэн гэсэн үг биш. `2026-09-10-production-deployment.md`-ийн app дүгнэлтүүд хэвээр.
Анхны админ үүсгээгүй; email болон хамгаалалттай credential хэрэгтэй.
Бүрэн browser login/assessment E2E, public external vantage шалгалт, remote backup
болон host reboot энэ startup ажилд хийгдээгүй.

Production workload-ийг буцаах шаардлагатай бол зөвхөн seek project-ийн app-уудыг
зогсоож, named volume-уудыг хадгална. `down -v` хэрэглэхгүй. Infra NPM болон OJ
stack-д хүрэхгүй. Cutover-ийн өмнөх NPM config/image snapshot .production/evidence-д бий.

## Public DNS замын нэмэлт шалгалт

Серверээс домэйны public IP 103.119.92.124:443 рүү шууд холбогдоход дөрвөн
хаяг timeout авсан (seek.mn дээр curl exit 28, TCP connect timeout батлагдсан).
Ижил домэйн/SNI-г --resolve ашиглан 10.10.10.6 руу чиглүүлэхэд TLS зөв,
upstream хариулж байна. Hairpin NAT эсвэл public NAT/firewall замын асуудал
байж болно; аль нь болохыг гаднын сүлжээнээс шалгаж ялгана. External client
хандалт ажиллахгүй гэж зөвхөн энэ серверийн timeout-оор дүгнээгүй.
