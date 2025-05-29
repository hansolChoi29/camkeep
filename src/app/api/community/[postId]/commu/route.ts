import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = serverSupabase();
  const { data: post, error } = await supabase
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
    .eq("id", params.id)
    .single();

  if (error || !post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(post, { status: 200 });
}

export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const { postId } = params;
  const { title, content } = await req.json();
  const supabase = serverSupabase();
  const { data, error } = await supabase
    .from("community_posts")
    .update({ title, content })
    .eq("id", postId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { postId: string } }
) {
  const { postId } = params;
  const supabase = serverSupabase();
  const { error } = await supabase
    .from("community_posts")
    .delete()
    .eq("id", postId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ message: "Deleted" }, { status: 200 });
}
