import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: { postId: string } }
) {
  // 1. 클라이언트 생성 (쿠키 write 필요 없음)
  const supabase = serverSupabase();

  // 2. 안전하게 유저 검증
  const { data: userData, error: authErr } = await supabase.auth.getUser();
  if (authErr || !userData.user) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  // 3. 실제 로직
  const { data, error } = await supabase
    .from("community_comments")
    .select("*")
    .eq("post_id", params.postId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
