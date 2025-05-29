"use client";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function Kakao() {
  const kakaoLogin = async () => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/oauth-callback`,
      },
    });

    if (error) {
      console.error("❌ 카카오 로그인 오류:", error.message);
    } else {
      console.log("📦 카카오 로그인 리디렉션:", data);
    }
  };
  return (
    <>
      <button onClick={kakaoLogin}>
        <Image src="/images/kakao.svg" alt="kakao" width={40} height={40} />
      </button>
    </>
  );
}
