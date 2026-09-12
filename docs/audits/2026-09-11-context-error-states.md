# Контекстийн алдааны төлөв — production гаргалт

2026-09-11: assessor/context болон context dashboard дээр 401/403, сервер/network алдаа, жинхэнэ хоосон жагсаалтыг ялгаж харуулах засварыг production portal-д байршуулсан. Retry, MN/EN тайлбартай.

Typecheck/build амжилттай. Verification ASSESSOR хэрэглэгчээр browser шалгалт: 403-ыг context-not-found гэж харуулахгүй, 500 алдаа, retry, 200 хоосон жагсаалт, dashboard 403 — давсан. Тестийн API хариунуудыг Playwright route-оор тусгаарлаж өгсөн. Production хэрэглэгч/өгөгдөл үүсгээгүй.

Image: seek-portal-web:context-errors-20260911. 14 сервис healthy. LAN HTTPS нэвтрээгүй context хүсэлт 307. Зөвхөн portal-web дахин үүсгэсэн. Буцаалт: seek-portal-web:before-context-errors-20260911. Private config/inspect/evidence: .production/evidence/context-errors/.

Энэ нь backend-ийн 403 шалтгааныг арилгаагүй. SUPER_ADMIN-only assessment бодлого хэвээр; ASSESSOR-д оноосон контекст эсвэл бүх нийтийн идэвхтэй контекстийг зөвшөөрөх сонголт шийдэгдээгүй. Бүрэн ASSESSOR authorization/ownership ажил дуусаагүй.
