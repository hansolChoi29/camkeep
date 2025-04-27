// src/app/my-page/page.tsx  (Async Server Component)
import { redirect } from "next/navigation";
import MypageClient from "./components/mypage.client";
import { serverSupabase } from "@/lib/supabase/server";

export const runtime = "edge";

export default async function MyPage() {
  const supabase = serverSupabase();

  // 1) 세션 체크
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect(`/auth/login?callbackUrl=/mypage`);
  }

  // 2) 프로필 조회 (DB 컬럼명을 정확히)
  const { data: profile, error } = await supabase
    .from("users")
    .select("nickname, phone_number, points, profile_img")
    .eq("id", session.user.id)
    .single();

  if (error || !profile) {
    redirect(`/auth/login?callbackUrl=/mypage`);
  }

  // 3) Nullable 값을 기본값으로 보정
  const nickname = profile.nickname ?? "";
  const phone = profile.phone_number ?? "";
  const points = profile.points ?? 0;
  const photo = profile.profile_img; // string | null 그대로

  // 4) 클라이언트 컴포넌트에 전달
  return (
    <MypageClient
      email={session.user.email!}
      userId={session.user.id}
      nickname={nickname}
      phone={phone}
      points={points}
      photo={photo}
    />
  );
}
