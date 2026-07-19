import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

// Legacy blog manager guard (query-param key) — kept until Blog auth is migrated.
const QUERY_PARAM = "key";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Protect the CMS dashboard: require a valid session cookie.
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySessionToken(token);
    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Legacy: protect the blog manage page via the MANAGE_KEY query param.
  if (pathname === "/blog/manage") {
    const provided = req.nextUrl.searchParams.get(QUERY_PARAM) || "";
    const expected = process.env.MANAGE_KEY || "";
    if (!expected || provided !== expected) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/blog/manage"],
};
