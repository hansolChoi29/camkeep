import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("community_comments")
    .select("id,created_at, post_id, user_id, content ");

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
export async function POST(request: Request) {
  const { post_id, user_id, content } = await request.json();
  const { data, error } = await supabaseAdmin
    .from("community_comments")
    .insert({ post_id, user_id, content })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
