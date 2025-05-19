// src/app/api/auth/google/callback/route.ts
import { headers, cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 1) Supabase 클라이언트 생성
  const supabase = createRouteHandlerClient({ headers, cookies });

  // 2) OAuth 코드 교환 & 쿠키에 세션 쓰기
  //    → 내부적으로 ?code=… 파라미터를 읽어서 토큰을 교환해 줍니다.
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession(); // 또는 getUser()를 써서 경고 없앨 수 있습니다.

  if (sessionError) {
    console.error("OAuth callback 에러:", sessionError);
    return NextResponse.redirect("/", { status: 303 });
  }

  // ⚠️ 경고 없애려면 아래처럼 getUser() 사용
  // const { data: userData, error: userError } = await supabase.auth.getUser();
  // if (userError) console.error("getUser 에러:", userError);

  // 3) 리다이렉트하고 싶은 최종 페이지로 보내기
  //    필요하면 query 로 next=/mypage 같은 값을 받도록 해도 됩니다.
  return NextResponse.redirect("/", { status: 303 });
}
