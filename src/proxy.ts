import { NextResponse, type NextRequest } from "next/server";

// Lightweight guard: redirect to login when the session cookie is absent.
// Full HMAC verification + user lookup happens in the admin layout/actions.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (!req.cookies.has("usf_session")) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
