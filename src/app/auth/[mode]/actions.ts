"use server";

import { redirect } from "next/navigation";
import { serverSupabase } from "@/lib/supabase/server";
import { cookies } from "next/headers";

// ─── 로그인 액션 ─────────────────────────────────────────
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const callbackUrl = (formData.get("callbackUrl") as string) || "/";
  console.log("🔥[loginAction] formData:", {
    email,
    password,
    callbackUrl,
  });
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

  // createRouteHandlerClient 제거, serverSupabase로 통일
  const supabase = await serverSupabase();

  // 관리자 권한으로 유저 생성 (service_role 키 사용)
  const { data: adminData, error: adminError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nickname, phone },
    });
  if (adminError) throw new Error(adminError.message);

  // 프로필 테이블 초기화
  const insertData = {
    id: adminData.user.id,
    email,
    nickname,
    phone,
    points: 10000,
    // created_at 는 테이블에 설정된 DEFAULT now() 가 알아서 채워줍니다.
  };

  const { error: insertError } = await supabase
    .from("users")
    .insert(insertData);
  if (insertError) throw new Error(insertError.message);

  redirect("/auth/login"); // 회원가입 후 로그인 페이지로
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
