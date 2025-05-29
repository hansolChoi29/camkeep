import { redirect } from "next/navigation";
import MypageClient from "./components/mypage.client";
import { serverSupabase } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function MyPage() {
  const supabase = serverSupabase();
  //1) 쿠키 기반 토큰 → Auth 서버에 검증
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return redirect("/auth/login?callbackUrl=/mypage");
  }

  // 1) 세션(토큰)  체크
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect(`/auth/login?callbackUrl=/mypage`);
  }

  // 2) 정확한 컬럼명으로 프로필 조회
  const { data: profile, error } = await supabase
    .from("users")
    .select("nickname, phone, points, profile")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect(`/auth/login?callbackUrl=/mypage`);
  }

  const { data: myPosts, error: postsError } = await supabase
    .from("community_posts")
    .select("id, title, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (postsError) {
    console.error("내 커뮤니티 조회 실패", postsError);
  }

  const nickname = profile.nickname;
  const phone = profile.phone;
  const points = profile.points ?? 0;
  const photo = profile.profile;
  // 3) props에 정확히 매핑
  return (
    <MypageClient
      email={session.user.email!}
      userId={user.id}
      nickname={nickname}
      phone={phone ?? ""}
      points={points}
      photo={photo}
      initialPosts={myPosts ?? []}
    />
  );
}
