import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(
  _req: Request,
  { params }: { params: { postId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  // 좋아요 개수 + 현재 사용자가 눌렀는지 여부
  const [{ count }, { data: sessionData }] = await Promise.all([
    supabase
      .from("post_likes")
      .select("id", { count: "exact", head: true })
      .eq("post_id", params.postId),
    supabase.auth.getSession(),
  ]);
  const userId = sessionData.data.session?.user.id;
  let liked = false;
  if (userId) {
    const { data } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", params.postId)
      .eq("user_id", userId)
      .maybeSingle();
    liked = !!data;
  }
  return NextResponse.json({ count, liked });
}

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session)
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  const userId = session.user.id;
  // 토글: 이미 눌렀으면 삭제, 아니면 삽입
  const { data: existing } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", params.postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    await supabase.from("post_likes").delete().eq("id", existing.id);
  } else {
    await supabase
      .from("post_likes")
      .insert({ post_id: params.postId, user_id: userId });
  }
  return NextResponse.json({ ok: true });
}
