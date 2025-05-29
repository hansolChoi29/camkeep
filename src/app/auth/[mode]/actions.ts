"use server";

import { redirect } from "next/navigation";
import { serverSupabase } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
// ─── 로그인 액션 ─────────────────────────────────────────
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const callbackUrl = (formData.get("callbackUrl") as string) || "/";

  if (!callbackUrl) throw new Error("callbackUrl is missing!");
  // ✅ 로그인 시에만 writeCookies: true
  const supabase = serverSupabase({ writeCookies: true });

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  redirect(callbackUrl);
}

// ─── 회원가입 액션 ────dkEK────────────────────────────────────
export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const nickname = formData.get("nickname") as string;
  const phone = formData.get("phone") as string;

  // 1) service_role 키로 새로운 유저 생성
  const { data: adminData, error: adminError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nickname, phone },
    });
  if (adminError) throw new Error(adminError.message);

  // 2) service_role 키로 프로필(users) 테이블 초기화
  const { error: insertError } = await supabaseAdmin.from("users").insert({
    id: adminData.user.id,
    email,
    nickname,
    phone,
    points: 10000,
  });
  if (insertError) throw new Error(insertError.message);

  // 3) 가입 완료 후 로그인 페이지로
  redirect("/auth/login");
}
// ─── 로그아웃 액션 ────────────────────────────────────────
export async function logout() {
  // 1) Supabase 세션 갱신(=signOut) 호출
  const supabase = serverSupabase({ writeCookies: true });
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("로그아웃 실패: " + error.message);

  // 2) sb- 로 시작하는 모든 Supabase 쿠키를 만료시킵니다.
  const cookieStore = cookies();
  for (const { name } of cookieStore.getAll()) {
    if (name.startsWith("sb-")) {
      cookieStore.set(name, "", { maxAge: 0, path: "/" });
    }
  }
  redirect("/auth/login");
}
//  ──────────────────소셜로그인 ───────────────────────
export async function kakaoLoginAction() {
  const supabase = serverSupabase({ writeCookies: true });
  const redirectUrl =
    process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL ||
    "http://localhost:3000/api/auth/kakao/callback";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: { redirectTo: redirectUrl },
  });

  if (error) throw new Error(`소셜 로그인 실패: ${error.message}`);
  if (!data?.url) throw new Error("Redirect URL이 없습니다.");

  redirect(data.url);
}
// ─── 구글 로그인  ───────────────────────────────────────
export async function googleLoginAction() {
  //googleLoginAction() 호출 OK
  // 1) 쿠키를 바로 기록하기 위해 writeCookies: true
  const supabase = serverSupabase({ writeCookies: true });
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/oauth-callback`,
    },
  });
  if (error) throw new Error(error.message);
  // Supabase가 준 URL로 이동
  redirect(data.url);
}
