# SUPER_ADMIN / ASSESSOR operator provisioning

Хэрэглэгчийн зөвшөөрлөөр bootstrap-admin.cjs-д role сонголт, duplicate/race хамгаалалт,
72-byte bcrypt хязгаар, нууц задлахгүй error handling, audit userAccountId нэмсэн.
create-user.py нь interactive credentials-ийг stdin-ээр production auth-д дамжуулна.
Image rebuild/restart, schema migration хийгээгүй.
Тест: default/allowed roles, invalid input, hashed credential, audit, duplicate refusal амжилттай.
Бодит email ирээгүй тул production аккаунт үүсгээгүй. Ашиглах заавар:
docs/runbooks/create-production-users.md.
Энэ дэд ажил дууссан; өмнөх өргөн production-readiness ажил нээлттэй хэвээр.
