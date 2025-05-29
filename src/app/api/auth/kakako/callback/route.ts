import { NextRequest, NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  console.log("📍 1. [START] /auth/oauth-callback");

  const supabase = serverSupabase({ writeCookies: true });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  console.log("📍 2. 세션 확인:", session);
  if (error || !session) {
    console.error("❌ 3. OAuth 세션 에러:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  console.log("📍 4. 사용자 정보:", userData);
  if (userError || !userData.user) {
    console.error("❌ 5. 사용자 정보 불러오기 실패:", userError);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const baseUrl = new URL(request.url).origin;
  console.log("📍 6. upsert 요청 전:", baseUrl);

  const res = await fetch(`${baseUrl}/api/users/upsert`, {
    method: "POST",
    body: JSON.stringify(userData.user),
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("📍 7. upsert 응답 상태:", res.status);

  console.log("📍 8. [END] 마이페이지 이동");
  return NextResponse.redirect(new URL("/mypage", request.url));
}
