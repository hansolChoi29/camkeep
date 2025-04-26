export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

// 서비스 롤 키로만 쓰이는 관리자용 클라이언트
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  req: Request,
  { params }: { params: { mode: string } }
) {
  const mode = params.mode; // "register" | "login" | "logout"
  const supabase = createRouteHandlerClient({ cookies: () => cookies() });

  // ─── 회원가입 ─────────────────────────────────────────
  if (mode === "register") {
    const { email, password, nickname, phone } = await req.json();

    // 관리용 클라이언트로 이메일 자동 확인(true) 상태로 계정 생성
    const { data: adminData, error: adminError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { nickname, phone },
      });
    if (adminError) {
      return NextResponse.json({ error: adminError.message }, { status: 400 });
    }

    // users 테이블에 프로필 정보 초기 저장
    const { error: insertError } = await supabaseAdmin.from("users").insert({
      id: adminData.user.id,
      email,
      nickname,
      phone,
      points: 10000,
      created_at: new Date(),
    });
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // ─── 로그인 ──────────────────────────────────────────
  if (mode === "login") {
    const { email, password } = await req.json();

    // 여기에서 data 대신 error만 구조분해
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.redirect(new URL("/mypage", req.url));
  }

  // ─── 로그아웃 ─────────────────────────────────────────
  if (mode === "logout") {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // ─── 알 수 없는 모드 ───────────────────────────────────
  return NextResponse.json(
    { error: `Unknown auth mode: ${mode}` },
    { status: 404 }
  );
}
