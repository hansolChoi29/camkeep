import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase/supabase-type";

// 클라이언트 컴포넌트 안에서만 호출하세요.
export function browserSupabase() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
