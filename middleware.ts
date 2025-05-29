import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createServerClient } from "@supabase/ssr";
import type { CookieMethodsServer, CookieOptions } from "@supabase/ssr";
import type { Database } from "@/types/supabase/supabase-type";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // ① Import and annotate cookieStore with the exact CookieMethodsServer type
  const cookieStore: CookieMethodsServer = {
    // getAll must return { name, value }[]
    getAll: () =>
      req.cookies.getAll().map(({ name, value }) => ({ name, value })),

    // setAll must accept { name, value, options: CookieOptions }[]
    setAll: (
      toSet: {
        name: string;
        value: string;
        options: CookieOptions;
      }[]
    ) => {
      toSet.forEach(({ name, value, options }) => {
        res.cookies.set(name, value, options);
      });
    },
  };

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: cookieStore }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (req.nextUrl.pathname.startsWith("/mypage") && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/mypage/:path*"],
};
