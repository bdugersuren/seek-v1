# Active Task: Шинэ портын хуваарилалт болон Subdomain тохиргоо

Status: `IN_PROGRESS`

## Алхмууд:
- [x] 1. Frontend аппликейшнуудад (`portal-web`, `assessment-web`) зориулсан custom Dockerfile үүсгэх
- [x] 2. Үйлчилгээ үүсгэх `scaffold-services.sh` скриптийг шинэ портын стандартаар шинэчлэх (Gateway 3010, Auth 3020...)
- [x] 3. Бизнес үйлчилгээнүүдийн Dockerfile доторх EXPOSE портуудыг шинэчлэх
- [x] 4. `apps/portal-web` болон `apps/assessment-web` package.json дахь dev/start портуудыг 8081, 8082 болгож шинэчлэх
- [x] 5. `docker-compose.yml` файлыг шинэ портын хуваарилалт болон `seek-<name>` нэршлийн стандартаар шинэчлэх
- [x] 6. `docker-compose.dev.yml` файлыг шинэ портын mapping болон `seek-<name>` стандартаар шинэчлэх
- [x] 7. `.env` файлыг шинэ портуудаар шинэчлэх
- [x] 8. Контейнеруудыг дахин build хийж асаах
- [x] 9. Интеграцийн тест ажиллуулан баталгаажуулах
- [ ] 10. Өөрчлөгдсөн файлуудыг Git дээр commit хийж backup бэлдэх
