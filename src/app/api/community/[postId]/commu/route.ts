import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: { postId: string } }
) {
  const { postId } = params;
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
    .eq("id", postId)
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

  // 1) 댓글 삭제
  const { error: commentError } = await supabase
    .from("community_comments")
    .delete()
    .eq("post_id", postId);

  if (commentError) {
    console.error("댓글 삭제 에러:", commentError);
    return NextResponse.json({ error: commentError.message }, { status: 400 });
  }

  // 2) 좋아요 삭제
  const { error: likeError } = await supabase
    .from("post_likes")
    .delete()
    .eq("post_id", postId);

  if (likeError) {
    console.error("좋아요 삭제 에러:", likeError);
    return NextResponse.json({ error: likeError.message }, { status: 400 });
  }

  // 3) 포스트 삭제
  const { error: postError } = await supabase
    .from("community_posts")
    .delete()
    .eq("id", postId);

  if (postError) {
    console.error("포스트 삭제 에러:", postError);
    return NextResponse.json({ error: postError.message }, { status: 400 });
  }

  return NextResponse.json({ message: "삭제 성공" }, { status: 200 });
}
