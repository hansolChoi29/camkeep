import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: { mode: string } }
) {
  const { mode } = params;
  const supabase = createRouteHandlerClient({ cookies });
  const body = await req.json();

  if (mode === "login") {
    const { email, password } = body;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error)
      return NextResponse.json({ error: error.message }, { status: 401 });
  } else if (mode === "register") {
    const { email, password, nickname, phone } = body;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname, phone } },
    });
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
  } else {
    return NextResponse.json({ error: "Invalid auth mode" }, { status: 400 });
  }

  // 성공 시 클라이언트로 OK를 돌려주거나 redirect 처리
  return NextResponse.json({ ok: true });
}
