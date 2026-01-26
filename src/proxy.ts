// 


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Public routes
  if (
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const sessionCookie =
      req.cookies.get("better-auth.session_token") ||
      req.cookies.get("__Secure-better-auth.session_token");

    if (!sessionCookie) {
      const signInUrl = new URL("/sign-in", req.url);

      // Save full path (including query)
      signInUrl.searchParams.set(
        "redirect",
        pathname + search
      );

      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

