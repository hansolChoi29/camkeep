import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase/supabase-type";
import type { CookieMethodsServer } from "@supabase/ssr";

export function serverSupabase() {
  const reqCookies = cookies();

  const cookieStore: CookieMethodsServer = {
    getAll: () =>
      // RequestCookies.getAll() 은 { name, value }[] 을 리턴하므로,
      // 여기에 options 없이도 CookieMethodsServer가 허용합니다.
      reqCookies.getAll().map(({ name, value }) => ({ name, value })),

    setAll: (toSet) =>
      toSet.forEach(({ name, value, options }) =>
        // NextResponse는 res.cookies (Edge Runtime) 또는 Response.cookies (Node.js) 에서 set 메서드를 제공합니다.
        // options 객체도 CookieOptionsWithName 타입이므로 그대로 전달하면 됩니다.
        cookies().set(name, value, options)
      ),
  };

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: cookieStore }
  );
}
