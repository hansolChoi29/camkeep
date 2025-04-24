import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  req: Request,
  { params }: { params: { mode: string } }
) {
  const mode = params.mode;
  const supabase = createRouteHandlerClient({ cookies });
  // 회원가입
  if (mode === "register") {
    const { email, password, nickname, phone } = await req.json();

    // 1) 관리용 클라이언트로 “자동 확인(true)”된 계정 생성
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

    // 2) 프로필 테이블에도 insert
    const { error: insertError } = await supabase.from("users").insert({
      id: adminData.user.id,
      email,
      nickname,
      phone,
      points: 10000, // NOT NULL 컬럼 초기값
      created_at: new Date(),
    });
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  }

  // 로그인
  if (mode === "login") {
    const { email, password } = await req.json();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error)
      return NextResponse.json({ error: error.message }, { status: 401 });
    return NextResponse.json({ ok: true });
  }

  // 로그아웃
  if (mode === "logout") {
    const { error } = await supabase.auth.signOut();
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    // 세션 쿠키를 자동으로 지워 줍니다.
    return NextResponse.json({ ok: true });
  }

  // 모드가 잘못된 경우
  return NextResponse.json(
    { error: `Unknown auth mode: ${mode}` },
    { status: 404 }
  );
}
