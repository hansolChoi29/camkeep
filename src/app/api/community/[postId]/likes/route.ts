import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: { postId: string } }
) {
  const supabase = serverSupabase({ writeCookies: true });
  // 1) 세션 확인 (유저가 로그인되어 있다면 liked 여부도 반환)
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user.id;

  // 2) 해당 포스트 전체 좋아요 수 조회
  const { count, error: countError } = await supabase
    .from("post_likes")
    .select("id", { head: true, count: "exact" })
    .eq("post_id", params.postId);

  if (countError)
    return NextResponse.json({ error: countError.message }, { status: 500 });

  // 3) 로그인된 유저가 이미 좋아요 눌렀는지 여부
  let liked = false;
  if (userId) {
    const { data: existing, error: exError } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", params.postId)
      .eq("user_id", userId)
      .single();

    if (exError && exError.code !== "PGRST116") {
      // PGRST116 = no rows, 무시
      return NextResponse.json({ error: exError.message }, { status: 500 });
    }
    liked = !!existing;
  }

  return NextResponse.json({ count, liked });
}

export async function POST(
  _req: Request,
  { params }: { params: { postId: string } }
) {
  const supabase = serverSupabase({ writeCookies: true });
  // 1) 로그인 검사
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session)
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  const userId = session.user.id;

  // 2) 토글 로직: 이미 눌렀으면 삭제, 아니면 삽입
  const { data: existing } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", params.postId)
    .eq("user_id", userId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("post_likes")
      .delete()
      .eq("id", existing.id);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabase
      .from("post_likes")
      .insert({ post_id: params.postId, user_id: userId });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 3) 토글 후 최신 count 가져오기
  const { count, error: cntErr } = await supabase
    .from("post_likes")
    .select("id", { head: true, count: "exact" })
    .eq("post_id", params.postId);
  if (cntErr)
    return NextResponse.json({ error: cntErr.message }, { status: 500 });

  return NextResponse.json({ count });
}
