import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { cookies, nextUrl } = request;
  const token = cookies.get("token")?.value;

  if (nextUrl.pathname.startsWith("/mypage") && !token) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/mypage/:path*"],
};
