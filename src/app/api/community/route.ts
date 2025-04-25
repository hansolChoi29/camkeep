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
  // 1) 세션을 포함한 Supabase 클라이언트 생성
  const supabase = createRouteHandlerClient({ cookies });

  // 2) 로그인 세션 확인
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }
  const user_id = session.user.id;

  // 3) 요청 바디에서 제목과 내용만 파싱
  const { title, content } = await request.json();

  try {
    // 4) insert 시 user_id는 세션 값 사용
    const { data, error } = await supabase
      .from("community_posts")
      .insert({ title, content, user_id })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Inserted post:", data);
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Unexpected POST error:", message);
    return NextResponse.json(
      { error: message || "Unknown error" },
      { status: 500 }
    );
  }
}
