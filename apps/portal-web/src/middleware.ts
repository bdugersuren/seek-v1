import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const enableMock = process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH !== "false";

  // Хэрэв mock горим асаалттай бол middleware-ийг алгасна
  if (enableMock) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // Нээлттэй замууд (Authentication pages)
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  // Статик файлууд болон API замуудыг алгасах
  const isStaticAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico";

  if (isStaticAsset) {
    return NextResponse.next();
  }

  // 1. Хэрэглэгч нэвтрээгүй (cookie байхгүй) бөгөөд хамгаалалттай зам руу хандаж байвал
  if (!refreshToken && !isAuthPage && pathname !== "/") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Хэрэглэгч нэвтэрсэн (cookie байгаа) бөгөөд нэвтрэх хуудас руу хандаж байвал
  if (refreshToken && isAuthPage) {
    return NextResponse.redirect(new URL("/catalog", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
