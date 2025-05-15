import { serverSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CheckListClient from "./components/check-list.client";

export const runtime = "edge";

export default async function CheckListPage() {
  const supabase = serverSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect(`/auth/login?callbackUrl=/check-list`);
  return <CheckListClient />;
}
