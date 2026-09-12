# Production хэрэглэгч үүсгэх

Серверийн terminal дээр /home/exe/seek-v1-ээс ажиллуулна. Docker эрх шаардлагатай.
NPM админ хэрэглэгчээс тусдаа SEEK application хэрэглэгч үүсгэнэ.

```bash
cd /home/exe/seek-v1
python3 scripts/create-user.py --role SUPER_ADMIN
python3 scripts/create-user.py --role ASSESSOR
```

Команд бүр email болон хоёр удаа нууц үг асууна. Password terminal дээр харагдахгүй,
shell history/argv/файлд хадгалагдахгүй, auth процесс руу stdin-ээр дамжина.
Дор хаяж 16 тэмдэгт, UTF-8 72 byte-аас ихгүй password хэрэглэнэ.
Хоёр аккаунтад тусдаа email ашиглана. Скрипт email-ийг lowercase/trim болгоно.

Шинэ account ACTIVE, isEmailVerified=true төлөвтэй, сонгосон ганц role-той үүснэ.
Энэ нь операторын provisioning тул email илгээхгүй; email эзэмшигчийг оператор батална.
Байгаа аккаунтыг өөрчлөхгүй. Давхардсан email алдаа өгнө. Role болон account/audit
бичилт нэг transaction дотор хийгдэнэ. Нууц үг bcrypt hash хэлбэрээр хадгалагдана.

Амжилттай бол https://seek.mn/login дээр нэвтэрнэ. SUPER_ADMIN нь
https://seek.mn/superadmin/users дээр бусдын дүр удирдана. ASSESSOR role нь
бүтээгдэхүүний дутуу authoring/tenant authorization боломжийг автоматаар нээхгүй.

Wrapper нь repo дахь bootstrap-admin.cjs-ийн одоогийн хувилбарыг ажиллаж буй
production auth контейнерт node -e хэлбэрээр ажиллуулдаг. Credential argv-д орохгүй.
Сервис restart эсвэл image build шаардлагагүй. Контейнерийн /app/scripts дээрх
хуучин хувилбар нь дараагийн image build хүртэл хэвээр тул энэ wrapper-ийг хэрэглэнэ.
Хуучин JSON хэлбэрийн role байхгүй input SUPER_ADMIN хэвээр хадгалагдсан.

Тест: scripts/bootstrap-admin.test.cjs. Дүрүүд, input validation, audit болон
existing-account хамгаалалт fake Prisma-аар батлагдсан; production DB тестээр өөрчлөгдөөгүй.

Хэрэгслийн өөрчлөлтөөс буцахад өмнөх bootstrap скриптээ сэргээж болно. Өмнө үүсгэсэн
account-ыг code rollback устгахгүй; шаардлагатай бол админ UI-аар тусад нь удирдана.
