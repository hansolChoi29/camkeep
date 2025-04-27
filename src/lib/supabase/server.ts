import { createServerClient, CookieOptionsWithName } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase/supabase-type";

export function serverSupabase() {
  const cookieStore = cookies();

  const cookieMethods = {
    // 읽기만 필요!
    getAll: () =>
      cookieStore.getAll().map(({ name, value }) => ({ name, value })),

    // 쓰기는 하지 않는다
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setAll: (
      toSet: { name: string; value: string; options?: CookieOptionsWithName }[]
    ) => {
      /* no-op */
    },
  };

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: cookieMethods }
  );
}
