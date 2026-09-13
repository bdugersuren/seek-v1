# Question bank — хэрэгжүүлэлтийн тайлан

2026-09-12: зөвшөөрсөн өөрчлөлтүүд production-д нэвтэрсэн.

## Хэрэгжүүлэлт

- Асуултын 13 төрөл өөрийн icon/нэртэй; сонголтын дугаар A–Z, AA… хэлбэртэй, дотоод ID харагдахгүй.
- Бодит хүндрэлийн нэр/өнгө, workflow төлөв болон зөвшөөрөгдсөн үйлдлүүд харагдана.
- Success Rate нь execution сервисийн бодит үнэлэгдсэн оролдлогын статистик. 0%, өгөгдөлгүй, түр боломжгүй төлөв ялгаатай.
- Эрхээр хязгаарласан серверийн хайлт, шүүлтүүр, хуудаслалт; алдаа болон дахин оролдох төлөвтэй.
- Matching per-option/combination validation, matrix мөр/багана, preview, хадгалалт болон батлуулах хүсэлт засагдсан. Заавал бус тайлбар хүсэлт илгээхийг хориглохгүй.
- Matching/matrix candidate хариулт хадгалах, reload, submit, автомат оноолт дэмжигдсэн. Зөв хариултын түлхүүр candidate payload-д дамжихгүй.
- Desktop/mobile overflow болон preview хүртээмж сайжирсан.

## Шалгалт

11 suite / 82 regression тест; дөрвөн сервисийн typecheck/build амжилттай.
PostgreSQL дээр 13 төрлийн create/save/submit, scope/filter/pagination шалгасан.
Эцсийн image дээр bank browser-ийн жагсаалт, хайлт, pagination, mobile/desktop, option add/save/reload, matching/matrix editor submit болон алдаа/retry давсан.
Эцсийн matching/matrix runtime browser-ийн assignment/login/start/save/reload/submit/receipt, өөр хэрэглэгчийн тусгаарлалт, grading/release давсан. Буруу матриц хариултын 0 оноо/0% тусдаа шалгасан.
Production LAN HTTPS/SNI: portal 200, нэвтрээгүй assessor хүсэлт 307, runtime 200, gateway readiness 200. Authenticated E2E тусгаарласан орчинд; production тест өгөгдөл нэмээгүй.

Гадаад DNS маршрутаар энэ серверээс хийсэн HTTP хүсэлтүүд timeout болсон; интернет талаас хүртээмжийг баталгаажуулаагүй. Дээрх production HTTPS шалгалт нь 10.10.10.6 LAN ingress рүү тухайн домэйны SNI/TLS-тай хийгдсэн.

## Production

Зөвхөн assessment/execution/portal-web/assessment-web шинэчлэгдсэн. Бусад сервисийн container ID хэвээр; нийт 14 сервис healthy.

| Сервис | Image |
|---|---|
| assessment / execution | seek-backend:question-bank-release-20260912 |
| portal-web | seek-portal-web:question-bank-complete-20260912 |
| assessment-web | seek-assessment-web:question-bank-release-20260912 |

Assessment/execution нөөцөөс тусдаа түр санд сэргээх шалгалт амжилттай. Schema migration хийгээгүй.
Нөөц: `/home/exe/seek-v1/.production/evidence/question-bank/production-before-20260912-125007`.
Нотолгоо: `.production/evidence/question-bank/`.

## Хязгаар ба буцаалт

13 төрөл authoring/submit-д шалгагдсан. Runtime-д өмнөх зургаан төрөл дээр MATCHING/MATRIX нэмэгдсэн; ORDERING/FILL_BLANK/LIKERT/SJT/CASE_BUNDLE publication gate хэвээр.
Матриц per-option оноолттой; хуучин combination draft-ийг тохируулах шаардлагатай. Нийтлэгдсэн snapshot өөрчлөгдөхгүй.
Шинэ structured active attempt байгаа үед хуучин runtime руу шууд буцаахгүй; зассан image-ээр урагш шинэчилнэ.
Дэлгэрэнгүй: [runbook](../runbooks/question-bank.md).
