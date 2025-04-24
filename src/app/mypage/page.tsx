import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MypageClient from "./components/mypage.client";

export default async function MyPage() {
  const supabase = createServerComponentClient({ cookies });

  // 1) 세션 체크
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect(`/auth/login?callbackUrl=/mypage`);
  }

  // 2) 프로필 정보 조회
  const { data: profile, error } = await supabase
    .from("users")
    .select("nickname, phone, points, photo")
    .eq("id", session.user.id)
    .single();

  if (error || !profile) {
    redirect(`/auth/login?callbackUrl=/mypage`);
  }

  // 3) 클라이언트에 props 전달
  return (
    <MypageClient
      email={session.user.email!}
      userId={session.user.id}
      nickname={profile.nickname}
      phone={profile.phone}
      points={profile.points}
      photo={profile.photo}
    />
  );
}
