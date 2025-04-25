import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// 게시글 목록 조회: 변경 없음
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase
    .from("community_posts")
    .select(
      `
        id,
        title,
        content,
        created_at,
        user:users (
          nickname,
          photo
        )
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET /api/community error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// 새 게시글 삽입: 클라이언트에서 user_id를 받지 않고, 세션 기반으로 처리
export async function POST(request: Request) {
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

  const { title, content, photos } = await request.json();
  const user_id = session.user.id;

  const { data, error } = await supabase
    .from("community_posts")
    .insert({ title, content, photos, user_id })
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
