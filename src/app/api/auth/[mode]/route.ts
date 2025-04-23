import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: { mode: string } }
) {
  const mode = params.mode;

  if (mode !== "login" && mode !== "register") {
    return NextResponse.json(
      { error: `Unknown auth mode: ${mode}` },
      { status: 404 }
    );
  }

  const supabase = createRouteHandlerClient({ cookies });
  const { email, password, nickname, phone } = await req.json();

  if (mode === "login") {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error)
      return NextResponse.json({ error: error.message }, { status: 401 });
    return NextResponse.json({ ok: true });
  } else {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname, phone } },
    });
    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  }
}
