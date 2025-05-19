// export const runtime = "nodejs";

// import { NextRequest, NextResponse } from "next/server";
// import { serverSupabase } from "@/lib/supabase/server";

// export async function GET(request: NextRequest) {
//   const supabase = serverSupabase({ writeCookies: true });
//   const {
//     data: { session },
//     error: sessionError,
//   } = await supabase.auth.getSession();
//   if (sessionError || !session) {
//     console.error("OAuth 콜백 에러:", sessionError);
//     return NextResponse.redirect(new URL("/auth/login", request.url), 303);
//   }

//   // — 여기서 auth.getUser() 로 유저 메타데이터까지 가져오기
//   const {
//     data: { user },
//     error: userError,
//   } = await supabase.auth.getUser();
//   if (userError || !user) {
//     console.error("세션 검증 실패:", userError);
//     return NextResponse.redirect(new URL("/auth/login", request.url), 303);
//   }

//   // — users 테이블에 upsert (한 번만 삽입되도록)
//   const { error: upsertError } = await supabase
//     .from("users")
//     .upsert({
//       id: user.id,
//       email: user.email!,
//       nickname: user.user_metadata.full_name || user.email?.split("@")[0],
//       phone: user.user_metadata.phone_number || null,
//       profile: user.user_metadata.avatar_url || null,
//       points: 0,
//     })
//     .eq("id", user.id); // 이미 있으면 업데이트
//   if (upsertError) {
//     console.error("유저 프로필 동기화 실패:", upsertError);
//     // (여기선 무시하고 진행해도 되고, 에러 페이지로 보낼 수도 있습니다)
//   }

//   // 최종적으로 마이페이지로
//   return NextResponse.redirect(new URL("/", request.url), 303);
// }
import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  console.log("[3] /api/auth/google/callback 진입", request.url);
  const supabase = serverSupabase({ writeCookies: true });
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  console.log("[4] getSession 결과", { session, error });
  if (error || !session) {
    console.error("[5] 세션 교환 실패:", error);
    console.error("OAuth 콜백 에러:", error);
    return NextResponse.redirect(new URL("/auth/login", request.url), 303);
  }
  console.log("[6] 세션 교환 성공, 유저:", session.user);
  return NextResponse.redirect(new URL("/", request.url), 303);
}
