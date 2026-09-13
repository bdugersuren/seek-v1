# Blueprint устгах

Ерөнхий эсвэл контекстийн **Blueprint** жагсаалтын карт эсвэл хүснэгт дээр **Устгах** товчийг дарж баталгаажуулна. Болиход өгөгдөл өөрчлөгдөхгүй. Амжилттай устгасны дараа жагсаалт, сонголт, нээлттэй урьдчилан харах төлөв шинэчлэгдэнэ.

- ASSESSOR зөвхөн өөрийн, эрхтэй контекстийн blueprint-ийг одоогийн access guard-ийн хүрээнд устгана. SUPER_ADMIN-ийн одоогийн эрх хэвээр.
- Quiz эсвэл quiz revision-д холбогдсон blueprint устахгүй; API 409 болон ойлгомжтой тайлбар буцаана.
- Ашиглагдаагүй blueprint-ийн хэсгүүд, хэсэг–асуултын холбоосууд устна. Даалгаврын сангийн асуултууд болон хувилбарууд устахгүй.
- Устгал буцаах үйлдэлгүй тул эхлээд нэрийг шалгаж баталгаажуулна.

## Техникийн баталгаа

`DELETE /api/v1/assessment/blueprints/:id` нь transaction дотор template мөрийг `FOR UPDATE` түгжиж quiz болон revision холбоосуудыг шалгана. Foreign key зөрчил 409, байхгүй template 404 буцаана. Schema migration шаардахгүй. Давхар submit-ийг frontend хаана.

Шалгалт: assessment болон portal typecheck, blueprint service unit tests, `scripts/test-context-access.cjs` тусгаарласан API/browser regression. Production-д туршилтын өгөгдөл үүсгэхгүй.
