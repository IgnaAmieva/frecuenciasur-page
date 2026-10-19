import { NextRequest, NextResponse } from "next/server";

const PUBLIC_LOCALES = ["en", "pt"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, api routes, _next
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  // If path starts with /en or /pt, it's already locale-prefixed — let App Router handle it
  for (const locale of PUBLIC_LOCALES) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return NextResponse.next();
    }
  }

  // All other paths: rewrite internally to /es/... so the [locale] segment resolves
  const url = request.nextUrl.clone();
  url.pathname = `/es${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|api).*)"],
};
