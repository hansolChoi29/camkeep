import { serverSupabase } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// 카테고리 목록 조회
export async function GET(req: NextRequest) {
  const supabase = serverSupabase();

  // 인증된 사용자 정보 가져오기
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  //  유저별 카테고리 조회
  const { data, error } = await supabase
    .from("checklist_categories")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  //  성공 응답
  return NextResponse.json(data, { status: 200 });
}
