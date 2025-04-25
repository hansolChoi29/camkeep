import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

//게시글 목록을 조회해 돌려주는 역할
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("community_posts")
    .select("id, title, content, created_at, user_id")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("GET /api/community error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}

//새로운 게시글을 삽입(insert)하는 역할
export async function POST(request: Request) {
  try {
    const { title, content, user_id } = await request.json();

    // 삽입 후 삽입된 행을 리턴받으려면 .select().single()이 필수
    const { data, error } = await supabaseAdmin
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
