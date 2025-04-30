import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = serverSupabase();
  const { data, error } = await supabase
    .from("community_posts")
    .select(
      `
      id,
      title,
      content,
      created_at,
      photos,
      user:users (
        nickname,
        profile    
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

export async function POST(request: Request) {
  const supabase = serverSupabase();

  // 2) 세션 확인
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  // 3) 요청 바디 읽기
  const { title, content, photos } = await request.json();
  const user_id = session.user.id;

  const { data, error } = await supabase
    .from("community_posts")
    .insert({ title, content, user_id, photos })
    .select(
      `
      id,
      title,
      content,
      created_at,
      user:users (
        nickname,
        profile
      )
    `
    )
    .single();

  if (error) {
    console.error("POST /api/community error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
