import { createServerClient, CookieOptionsWithName } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase/supabase-type";

export function serverSupabase({
  writeCookies = false,
}: { writeCookies?: boolean } = {}): SupabaseClient<Database> {
  const cookieStore = cookies();

  const cookieMethods = {
    getAll: () =>
      cookieStore.getAll().map(({ name, value }) => ({ name, value })),

    setAll: writeCookies
      ? (
          toSet: {
            name: string;
            value: string;
            options?: CookieOptionsWithName;
          }[]
        ) => {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, {
              secure: process.env.NODE_ENV === "production",
              ...options,
            })
          );
        }
      : () => {},
  };

  // ← 이 줄이 빠지면 serverSupabase()가 undefined를 리턴합니다!
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieMethods,
      cookieOptions: { secure: process.env.NODE_ENV === "production" },
    }
  );
}
