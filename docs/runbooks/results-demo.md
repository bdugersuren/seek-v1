# Results жишиг тайлан

`/assessor/results` нь ASSESSOR эрхтэй хэрэглэгчид зориулсан интерактив загвар. Бүх нэр, оролдлого, хариулт зохиомол; өгөгдлийн санд бичихгүй, тайлангийн backend API дуудахгүй.

## Өгөгдөл ба тооцоолол

`features/results/demo/model.ts` нь 13 төрлийн асуулт, 12 оролцогч, 16 оролдлогын эх өгөгдөл. Нийт боломжит оноо 48. Likert оноогүй; кейс хоёр дэд асуулттай ч нийтэд 4 оноогоор нэг удаа орно. Хэсэгчилсэн оноог дотооддоо нарийвчлалтай хадгалж, харуулахдаа хоёр орны нарийвчлалд тоймлоно.

Тэнцэх босго 70%. Гар үнэлгээ хүлээж байгаа оролдлогыг эцсийн тэнцсэн/тэнцээгүй гэж дүгнэхгүй, leaderboard-д оруулахгүй. Эрэмбэ нь хүн бүрийн эцэслэн үнэлэгдсэн шилдэг оноо; ижил оноонд ижил байр, дараагийн байр алгасана (1, 1, 3). Хугацаагаар тэнцүү оноог задлахгүй.

Үнэлэгчийн дундаж/тархалт нь эцэслэн үнэлэгдсэн бүх оролдлогоор; асуултын хүснэгт нь тухайн асуултаар үнэлэгдсэн хариултаар тооцогдоно. n нь denominator-ийг тодруулна. Pending эсвэл оноогүй өгөгдлийг 0%-тай андуурахгүй.

## UI

Харах өнцөг, таб, оролцогч, оролдлого, жишиг төлөв, сонгосон асуулт URL query-д хадгалагдана. Search/type/status filter нь тухайн нээлттэй хуудсын төлөв. Browser back болон reload ажиллана.

Хэвлэх/PDF нь одоогийн таб болон харах өнцгийг browser print-ээр гаргана. Хяналтын элементүүд нуугдаж, жишиг тэмдэглэгээ хадгалагдана. Locked төлөвт зөв хариулт/шийдлийн хэсгүүд render хийгдэхгүй. Энэ нь зөвхөн зохиомол өгөгдлийн UI preview; бодит нууцлалын backend механизм биш.

ORDERING/FILL_BLANK/LIKERT/SJT/CASE_BUNDLE-ийн Solutions дээр runtime дэмжлэг нээгдээгүйг тэмдэглэнэ. Энэ ажил runtime-г нээхгүй.

## Шалгалт

Dependency орчинд:

```bash
NODE_ENV=test pnpm exec jest --config scripts/jest.results-demo.config.cjs --runInBand
pnpm --filter @seek/portal-web typecheck
```

`seek-verify`, `seek-check`, verification TLS болон өмнө үүсгэсэн admin тестийн аккаунттай орчинд:

```bash
python3 scripts/verify-results-demo.py
```

Browser тест зөвхөн тусгаарласан auth санд түр ASSESSOR үүсгээд цэвэрлэнэ; production-д fixture үүсгэхгүй. 24 viewport/tab/view screenshot, 13 төрлийн screenshot болон PDF `/tmp/results-demo` дотор үүсгэнэ.

## Нэвтрүүлэлт

Зөвхөн portal-web image солино; DB migration/backup шаардсан өгөгдлийн өөрчлөлт байхгүй. Өмнөх portal image болон бусад сервисийн container ID-г evidence-д хадгалж, шинэчлэлтийн дараа health болон unrelated ID-уудыг шалгана. Буцаалт нь өмнөх image tag-аар `up --no-deps --no-build --pull never --wait portal-web`.
