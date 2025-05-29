import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: { postId: string } }
) {
  const supabase = serverSupabase();
  const { data, error } = await supabase
    .from("community_comments")
    .select(
      `
      id,
      content,
      created_at,
      user:users(nickname,profile)
    `
    )
    .eq("post_id", params.postId)
    .order("created_at", { ascending: true });
  if (error) {
    console.error("GET /api/community/[postId]/comments error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  // 서버로 바꿔놓음
  const supabase = serverSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session)
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );

  const { content } = await request.json();
  const { data, error } = await supabase
    .from("community_comments")
    .insert({ post_id: params.postId, user_id: session.user.id, content })
    .select(
      `
      id,
      content,
      created_at,
      user:users(nickname,profile)
    `
    )
    .single();

  if (error) {
    console.error("POST /api/community/[postId]/comments error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
