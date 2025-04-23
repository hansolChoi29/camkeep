import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MypageClient from "./_components/mypage.client";

export default async function MyPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(`/auth/login?callbackUrl=/mypage`);
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("nickname, phone")
    .eq("id", session.user.id)
    .single();

  if (profileError || !profile) {
    redirect(`/auth/login?callbackUrl=/mypage`);
  }

  return (
    <MypageClient
      email={session.user.email!}
      userId={session.user.id}
      nickname={profile.nickname}
      phone={profile.phone}
    />
  );
}
