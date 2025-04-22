import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MypageClient from "./_components/mypage.client";

export default async function MyPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log("🔥 server session:", session);
  if (!session) {
    redirect(`/auth/login?callbackUrl=/mypage`);
  }

  return <MypageClient email={session.user.email!} />;
}
