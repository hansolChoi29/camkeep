import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const supabase = serverSupabase();
  // 1) 현재 세션·유저 조회
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user.id;

  // 2) 전체 좋아요 개수 조회
  const { count, error: countError } = await supabase
    .from("post_likes")
    .select("id", { count: "exact", head: true })
    .eq("post_id", params.postId);
  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  // 3) 내가 좋아요 눌렀는지도 조회
  let liked = false;
  if (userId) {
    const { data: existing, error: findError } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", params.postId)
      .eq("user_id", userId)
      .single();
    if (findError && findError.code !== "PGRST116") {
      // PGRST116 = no rows, 무시
      return NextResponse.json({ error: findError.message }, { status: 500 });
    }
    liked = !!existing;
  }

  return NextResponse.json({ count, liked });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const supabase = serverSupabase({ writeCookies: true });
  // 1) 세션 확인
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }
  const userId = session.user.id;

  // 2) 기존 좋아요 레코드가 있으면 삭제, 없으면 생성
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
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ liked: false });
  } else {
    const { error } = await supabase
      .from("post_likes")
      .insert({ post_id: params.postId, user_id: userId });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ liked: true });
  }
}
