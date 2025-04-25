// src/app/api/community/[postId]/likes/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(
  _req: Request,
  { params }: { params: { postId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  // 좋아요 총 개수 조회
  const { count } = await supabase
    .from("post_likes")
    .select("id", { count: "exact", head: true })
    .eq("post_id", params.postId);

  // 내가 눌렀는지도 확인
  const {
    data: { session },
  } = await supabase.auth.getSession();
  let liked = false;
  if (session) {
    const { data } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", params.postId)
      .eq("user_id", session.user.id)
      .maybeSingle();
    liked = !!data;
  }

  return NextResponse.json({ count, liked });
}

export async function POST(
  _req: Request,
  { params }: { params: { postId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
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
