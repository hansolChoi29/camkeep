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
  const { email, password, nickname, phone } = body;

  if (mode === "login") {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
  } else if (mode === "register") {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname, phone } },
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: "Invalid auth mode" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
