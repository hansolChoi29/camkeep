import { createServerClient, CookieOptionsWithName } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase/supabase-type";

export function serverSupabase({
  writeCookies = false,
}: {
  writeCookies?: boolean;
} = {}) {
  const cookieStore = cookies();

  const cookieMethods = {
    // 읽기만 필요!
    getAll: () =>
      cookieStore.getAll().map(({ name, value }) => ({ name, value })),

    // 쓰기는 하지 않는다
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setAll: writeCookies
      ? (
          //toSet: Supabase가 쿠키를 “써야 할 때” 넘겨주는 정보 묶음
          toSet: {
            name: string;
            value: string;
            options?: CookieOptionsWithName;
          }[]
        ) => {
          // writeCookies=true 일 때만 실제로 쿠키를 씁니다
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        }
      : (
          _toSet: {
            name: string;
            value: string;
            options?: CookieOptionsWithName;
          }[]
        ) => {
          void _toSet; // 사용한 것으로 간주 → ESLint 경고 사라짐
        },
  };

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: cookieMethods }
  );
}
