import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = serverSupabase({ writeCookies: true });
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // 로그인 실패 시
  if (error || !session) {
    // request.url 을 기준으로 절대경로 생성
    return NextResponse.redirect(new URL("/auth/login", request.url), {
      status: 303,
    });
  }

  // 로그인 성공 시
  return NextResponse.redirect(new URL("/mypage", request.url), {
    status: 303,
  });
}
