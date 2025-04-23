// src/app/api/user/photo/route.ts
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  // Supabase 클라이언트
  const supabase = createRouteHandlerClient({ cookies });

  // --- 1) 요청에 어떤 쿠키가 붙어왔는지 확인
  console.log("🍪 incoming cookies:", req.headers.get("cookie"));

  // --- 2) 세션 읽기
  const {
    data: { session },
    error: sessionErr,
  } = await supabase.auth.getSession();
  console.log("🔑 supabase session:", session, "err:", sessionErr);
  if (!session) {
    return NextResponse.json({ error: "세션 없음" }, { status: 401 });
  }

  // --- 3) body 확인
  const { publicUrl } = await req.json();
  console.log("🏷 got publicUrl:", publicUrl);

  // --- 4) 실제 업데이트 시도 전, user.id 확인
  console.log("👤 updating for user.id =", session.user.id);

  const { data, error } = await supabase
    .from("users")
    .update({ photo: publicUrl })
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error("🚨 UPDATE 에러:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  console.log("✅ 업데이트 성공:", data);
  return NextResponse.json({ ok: true, user: data });
}
