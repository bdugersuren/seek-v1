# Results — интерактив жишиг тайлан

## Хэрэгжүүлсэн загвар

`/assessor/results` дээр үнэлэгчийн анализ / шалгуулагчийн тайлан гэсэн хоёр өнцөгтэй, Analysis / Solutions / Top Scorers табтай жишиг загвар хэрэгжив. Бүх дэлгэц, хэвлэх хувилбар жишиг тэмдэглэгээтэй. 12 зохиомол оролцогч, 16 оролдлого, 13 төрлийн асуулттай.

Analysis нь оноо, хугацаа, хариултын төлөв, сэдэв/хүндрэл/төрлийн задаргаа, бүлгийн тархалт, асуултын гүйцэтгэлийг харуулна. Үнэлэгчийн хүснэгтээс асуултын Solutions руу шилжинэ. Шалгуулагч алдаатай асуултуудаа шүүж давтана.

Solutions нь 13 тусдаа төрлийн дүрслэлтэй: үсгэн сонголт, дарааллын харьцуулалт, харгалзааны хүснэгт, өгүүлбэр дотор нөхсөн утга, матрицын нүд/мөрийн оноо, тоон хүлцэл, Likert шкал, SJT оноо, кейсийн дэд асуулт, эсээний рубрик. Өгсөн болон зөв/жишиг хариулт ялгаатай; тайлбар, оноолтыг харуулна. Өнгөнөөс гадна бичиг/icon ашиглана.

Top Scorers нь шилдэг эцсийн оролдлогоор хүнийг эрэмбэлнэ. Тэнцүү оноо ижил байртай. Сонгосон оролцогчийг тодруулж, үнэлэгч хүний тайлан руу шилжинэ. Mobile дээр карт хэлбэртэй.

## Төлөв, тооцоолол

- Үнэлэгдсэн, гар үнэлгээ хүлээж байгаа, шийдэл нээгдээгүй, өгөгдөлгүй төлөвийг сонгож үзнэ.
- Нийт боломжит оноо 48; Likert оноонд орохгүй, кейсийн дэд оноог давхар тоолохгүй.
- Pending оролдлогыг эцэслэн тэнцсэн/унасан гэж үзүүлэхгүй, эрэмбэд оруулахгүй.
- Таб/өнцөг/оролцогч/оролдлого/жишиг төлөв/асуулт URL-д хадгалагдана. Filter-ээр сонгосон асуулт ч reload хийхэд сэргээнэ.
- Print нь одоогийн таб, харах өнцгийг гаргана; locked шийдэл болон хяналтын товчнууд нуугдана.

Энэ бол UI жишээ. Backend тайлангийн API, schema, бодит өгөгдөл, AI болон runtime хөдөлгүүр өөрчлөгдөөгүй. ORDERING/FILL_BLANK/LIKERT/SJT/CASE_BUNDLE дээр runtime дэмжлэг нээгдээгүйг тэмдэглэнэ. Admin results-ийн хуучин гэрээ/хуудас хэвээр.

## Баталгаажуулалт

- Тооцооллын 8 regression тест амжилттай: fixture бүрэн байдал, structured score, Likert/кейс, pending, ties, empty/locked, бүлгийн нийлбэр, тархалт.
- Portal typecheck болон анхны production build амжилттай.
- Эхний browser: 2 өнцөг × 3 таб × 4 өргөн (375/768/1280/1440), 13 renderer, шүүлтүүр, төлөвүүд, URL reload/back, keyboard таб, хэвлэх/PDF, admin regression давсан.
- Desktop болон mobile screenshot-ийг харагдацаар хянасан.

Эцсийн `seek-portal-web:results-demo-complete-20260912` image дээр browser шалгалт амжилттай. Бүх 13 төрлийг mobile болон desktop дээр нэмж шалгасан. Filter-ээр сонгосон асуулт reload хийхэд сэргэсэн; select accessible нэршил баталгаажсан. Нийт 55 PNG screenshot, 2 PDF хадгалсан.

## Production нэвтрүүлэлт — дууссан

2026-09-12: зөвхөн portal-web шинэчлэгдсэн. Image: `seek-portal-web:results-demo-complete-20260912`; image ID: `sha256:45e468753aba57b2b5c3badd9f46538bd3dcf0bb743baa9ea19f679fe1373e4f`.

14 сервис healthy; бусад сервисийн container ID өөрчлөгдөөгүй. Өмнөх тохиргоо/сервисийн жагсаалт: `/home/exe/seek-v1/.production/evidence/results-demo/production-before-20260912-135052`.

Production LAN HTTPS/SNI шалгалт: portal 200, нэвтрээгүй `/assessor/results` 307, gateway readiness 200. Authenticated browser шалгалтыг тусгаарласан орчинд хийсэн; production тест аккаунт/өгөгдөл үүсгээгүй. Интернетийн гадна талаас хүртээмжийг энэ ажлаар шалгаагүй.

## Screenshot болон ажиллуулах заавар

Нотолгооны үндсэн хавтас: `.production/evidence/results-demo/`.
Тооцоолол/тест/буцаалтын заавар: [runbook](../runbooks/results-demo.md).

Дараагийн тусдаа ажлын боломжууд: бодит result API болон release-policy холболт; үлдсэн таван төрлийн runtime дэмжлэг.

## Харагдах хувилбарууд

| Өнцөг | Таб | Desktop | Mobile |
|---|---|---|---|
| Үнэлэгч | analysis | [Харах](../../.production/evidence/results-demo/screenshots/assessor-analysis-1440.png) | [Харах](../../.production/evidence/results-demo/screenshots/assessor-analysis-375.png) |
| Үнэлэгч | solutions | [Харах](../../.production/evidence/results-demo/screenshots/assessor-solutions-1440.png) | [Харах](../../.production/evidence/results-demo/screenshots/assessor-solutions-375.png) |
| Үнэлэгч | top-scorers | [Харах](../../.production/evidence/results-demo/screenshots/assessor-top-scorers-1440.png) | [Харах](../../.production/evidence/results-demo/screenshots/assessor-top-scorers-375.png) |
| Шалгуулагч | analysis | [Харах](../../.production/evidence/results-demo/screenshots/candidate-analysis-1440.png) | [Харах](../../.production/evidence/results-demo/screenshots/candidate-analysis-375.png) |
| Шалгуулагч | solutions | [Харах](../../.production/evidence/results-demo/screenshots/candidate-solutions-1440.png) | [Харах](../../.production/evidence/results-demo/screenshots/candidate-solutions-375.png) |
| Шалгуулагч | top-scorers | [Харах](../../.production/evidence/results-demo/screenshots/candidate-top-scorers-1440.png) | [Харах](../../.production/evidence/results-demo/screenshots/candidate-top-scorers-375.png) |

## Бүх төрлийн шийдлийн дүрслэл

| Төрөл | Desktop | Mobile |
|---|---|---|
| SINGLE_CHOICE | [Харах](../../.production/evidence/results-demo/screenshots/type-SINGLE_CHOICE.png) | [Харах](../../.production/evidence/results-demo/screenshots/mobile-type-SINGLE_CHOICE.png) |
| MULTIPLE_CHOICE | [Харах](../../.production/evidence/results-demo/screenshots/type-MULTIPLE_CHOICE.png) | [Харах](../../.production/evidence/results-demo/screenshots/mobile-type-MULTIPLE_CHOICE.png) |
| TRUE_FALSE | [Харах](../../.production/evidence/results-demo/screenshots/type-TRUE_FALSE.png) | [Харах](../../.production/evidence/results-demo/screenshots/mobile-type-TRUE_FALSE.png) |
| ORDERING | [Харах](../../.production/evidence/results-demo/screenshots/type-ORDERING.png) | [Харах](../../.production/evidence/results-demo/screenshots/mobile-type-ORDERING.png) |
| MATCHING | [Харах](../../.production/evidence/results-demo/screenshots/type-MATCHING.png) | [Харах](../../.production/evidence/results-demo/screenshots/mobile-type-MATCHING.png) |
| SHORT_TEXT | [Харах](../../.production/evidence/results-demo/screenshots/type-SHORT_TEXT.png) | [Харах](../../.production/evidence/results-demo/screenshots/mobile-type-SHORT_TEXT.png) |
| FILL_BLANK | [Харах](../../.production/evidence/results-demo/screenshots/type-FILL_BLANK.png) | [Харах](../../.production/evidence/results-demo/screenshots/mobile-type-FILL_BLANK.png) |
| MATRIX | [Харах](../../.production/evidence/results-demo/screenshots/type-MATRIX.png) | [Харах](../../.production/evidence/results-demo/screenshots/mobile-type-MATRIX.png) |
| NUMERIC | [Харах](../../.production/evidence/results-demo/screenshots/type-NUMERIC.png) | [Харах](../../.production/evidence/results-demo/screenshots/mobile-type-NUMERIC.png) |
| LIKERT | [Харах](../../.production/evidence/results-demo/screenshots/type-LIKERT.png) | [Харах](../../.production/evidence/results-demo/screenshots/mobile-type-LIKERT.png) |
| SJT | [Харах](../../.production/evidence/results-demo/screenshots/type-SJT.png) | [Харах](../../.production/evidence/results-demo/screenshots/mobile-type-SJT.png) |
| CASE_BUNDLE | [Харах](../../.production/evidence/results-demo/screenshots/type-CASE_BUNDLE.png) | [Харах](../../.production/evidence/results-demo/screenshots/mobile-type-CASE_BUNDLE.png) |
| ESSAY | [Харах](../../.production/evidence/results-demo/screenshots/type-ESSAY.png) | [Харах](../../.production/evidence/results-demo/screenshots/mobile-type-ESSAY.png) |

[Pending төлөв](../../.production/evidence/results-demo/screenshots/pending-state.png) · [Шийдэл нээгдээгүй](../../.production/evidence/results-demo/screenshots/locked-state.png) · [Өгөгдөлгүй](../../.production/evidence/results-demo/screenshots/empty-analysis.png)

[Хэвлэсэн PDF](../../.production/evidence/results-demo/screenshots/report.pdf) · [Шийдэл нуусан PDF](../../.production/evidence/results-demo/screenshots/locked-report.pdf)
