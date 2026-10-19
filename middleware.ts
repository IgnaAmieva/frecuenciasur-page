import { NextRequest, NextResponse } from "next/server";

const NON_DEFAULT_LOCALES = ["en", "pt"];

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

  // /es and /es/... → 301 redirect to strip the prefix (Spanish lives at root)
  if (pathname === "/es" || pathname.startsWith("/es/")) {
    const stripped = pathname.replace(/^\/es/, "") || "/";
    const url = request.nextUrl.clone();
    url.pathname = stripped;
    return NextResponse.redirect(url, 301);
  }

  // /en or /pt prefixed paths → let App Router handle via [locale] segment
  for (const locale of NON_DEFAULT_LOCALES) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return NextResponse.next();
    }
  }

  // All other paths (Spanish, unprefixed): rewrite internally to /es/...
  const url = request.nextUrl.clone();
  url.pathname = `/es${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|api).*)"],
};
