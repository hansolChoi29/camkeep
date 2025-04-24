import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: { mode: string } }
) {
  const mode = params.mode;
  const supabase = createRouteHandlerClient({ cookies });

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

  // 회원가입
  if (mode === "register") {
    const { email, password, nickname, phone } = await req.json();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname, phone } },
    });
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
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
