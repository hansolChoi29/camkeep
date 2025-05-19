import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = serverSupabase({ writeCookies: true });

  // URL에서 코드 추출
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    console.error("코드가 없습니다");
    return NextResponse.redirect(new URL("/auth/login", url), { status: 303 });
  }
  // 2) 코드 ↔ 세션 교환
  const {
    data: { session },
    error,
  } = await supabase.auth.exchangeCodeForSession({ auth_code: code });

  if (error || !session) {
    console.error("OAuth 콜백 세션 생성 실패:", error);
    return NextResponse.redirect(new URL("/auth/login", url), { status: 303 });
  }

  // 로그인 성공 시
  return NextResponse.redirect(new URL("/mypage", url), { status: 303 });
}
