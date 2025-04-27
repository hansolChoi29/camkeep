import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase/supabase-type";

export function serverSupabase() {
  const cookieStore = cookies();

  const cookieMethods = {
    // 읽기만 필요!
    getAll: () =>
      cookieStore.getAll().map(({ name, value }) => ({ name, value })),

    // 쓰기는 하지 않는다
    setAll: (_toSet: { name: string; value: string; options?: any }[]) => {
      /* no-op */
    },
  };

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: cookieMethods }
  );
}
