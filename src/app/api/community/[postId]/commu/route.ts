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
  const { title, content, photos } = (await req.json()) as {
    title: string;
    content: string;
    photos: string[];
  };
  const supabase = serverSupabase();

  // 1) 이전 photos 불러오기
  const { data: prev, error: getErr } = await supabase
    .from("community_posts")
    .select("photos")
    .eq("id", postId)
    .single();
  if (getErr) {
    console.error("PATCH:get existing photos error", getErr);
    return NextResponse.json({ error: getErr.message }, { status: 500 });
  }
  const prevPhotos: string[] =
    typeof prev.photos === "string"
      ? JSON.parse(prev.photos)
      : prev.photos || [];

  // 2) 삭제 대상 파일 경로 계산
  const toRemove = prevPhotos.filter((url) => !photos.includes(url));
  if (toRemove.length) {
    const paths = toRemove.map((url) => {
      const u = new URL(url);
      const idx = u.pathname.indexOf("post-photos");
      return u.pathname.substring(idx);
    });
    const { error: delErr } = await supabase.storage
      .from("post-photos")
      .remove(paths);
    if (delErr) console.error("Storage remove error:", delErr);
  }

  // 3) DB 업데이트
  // 3) DB 업데이트 (photos는 JSON 문자열로 저장)
  const photosJson = JSON.stringify(photos);
  const { data, error: updErr } = await supabase
    .from("community_posts")
    .update({ title, content, photos: photosJson })
    .eq("id", postId)
    .single();
  if (updErr) {
    console.error("PATCH:update post error", updErr);
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
export async function DELETE(
  _req: Request,
  { params }: { params: { postId: string } }
) {
  const { postId } = params;
  const supabase = serverSupabase();

  // a) 댓글 삭제
  await supabase.from("community_comments").delete().eq("post_id", postId);

  // b) 좋아요 삭제
  await supabase.from("post_likes").delete().eq("post_id", postId);

  // c) 삭제 전 photos 가져오기
  const { data: prev, error: getErr } = await supabase
    .from("community_posts")
    .select("photos")
    .eq("id", postId)
    .single();
  if (getErr) {
    console.error("DELETE:get existing photos error", getErr);
    return NextResponse.json({ error: getErr.message }, { status: 500 });
  }
  const prevPhotos: string[] =
    typeof prev.photos === "string"
      ? JSON.parse(prev.photos)
      : prev.photos || [];

  // d) 스토리지에서 파일 제거
  if (prevPhotos.length) {
    const paths = prevPhotos.map((url) => {
      const u = new URL(url);
      const idx = u.pathname.indexOf("post-photos");
      return u.pathname.substring(idx);
    });
    const { error: delErr } = await supabase.storage
      .from("post-photos")
      .remove(paths);
    if (delErr) console.error("Storage remove error:", delErr);
  }

  // e) DB 레코드 삭제
  const { error: postErr } = await supabase
    .from("community_posts")
    .delete()
    .eq("id", postId);
  if (postErr) {
    console.error("DELETE:post error", postErr);
    return NextResponse.json({ error: postErr.message }, { status: 500 });
  }

  return NextResponse.json({ message: "삭제 성공" }, { status: 200 });
}
