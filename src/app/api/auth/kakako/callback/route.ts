import { NextRequest, NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = serverSupabase({ writeCookies: true });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const baseUrl = new URL(request.url).origin;

  const res = await fetch(`${baseUrl}/api/users/upsert`, {
    method: "POST",
    body: JSON.stringify(userData.user),
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("📍 7. upsert 응답 상태:", res.status);

  return NextResponse.redirect(new URL("/", request.url));
}
