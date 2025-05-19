import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";

export const runtime = "edge";

export async function GET(request: Request) {
  // 콜백 URL에 붙은 ?code=… 를 getSession() 이 내부에서 교환하고
  const supabase = serverSupabase({ writeCookies: true });
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    console.error("Google OAuth 콜백 실패:", error);
    return NextResponse.redirect("/auth/login", { status: 303 });
  }

  // 정상 처리됐으면 원하는 페이지로 보내기
  return NextResponse.redirect("/mypage", { status: 303 });
}
