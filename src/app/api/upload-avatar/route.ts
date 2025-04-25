import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("avatar") as Blob | null;
  const userId = form.get("userId") as string | null;

  if (!file || !userId) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // 1) 스토리지에 업로드
  // const ext = (file as any).name.split(".").pop();
  const fileObj = file as File;

  const ext = fileObj.name.split(".").pop();

  const filePath = `${userId}/avatar.${ext}`;

  const { error: uploadErr, data: uploadData } = await supabaseAdmin.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });
  if (uploadErr) {
    return NextResponse.json({ error: uploadErr.message }, { status: 500 });
  }

  console.log("uploadData", uploadData);

  // 2) public URL 가져오기
  const { data: urlData } = supabaseAdmin.storage
    .from("avatars")
    .getPublicUrl(filePath);
  const publicUrl = urlData.publicUrl;

  console.log("urlData", urlData);

  // 3) users 테이블에 바로 업데이트 (서비스 롤 키이므로 RLS 무시)
  const { error: dbErr, data: user } = await supabaseAdmin
    .from("users")
    .update({ profile: publicUrl })
    .eq("id", userId)
    .single();
  if (dbErr) {
    return NextResponse.json({ error: dbErr.message }, { status: 500 });
  }

  console.log("user", user);

  return NextResponse.json({ publicUrl, user });
}

export async function GET() {
  return new Response("upload-avatar alive");
}
