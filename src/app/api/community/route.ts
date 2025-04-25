import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

//게시글 목록을 조회해 돌려주는 역할
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("community_posts")
    .select("id, title, content, created_at, user_id")
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

//새로운 게시글을 삽입(insert)하는 역할
export async function POST(request: Request) {
  const { title, content, user_id } = await request.json();
  const { data, error } = await supabaseAdmin
    .from("community_posts")
    .insert({ title, content, user_id });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data![0], { status: 201 });
}
