"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        console.error("유저 정보 없음", error);
        return;
      }

      const res = await fetch("/api/users/upsert", {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();
      if (!result.success) {
        console.error("업서트 실패", result.error);
        return;
      }

      console.log("마이페이지로 이동");
      router.replace("/");
    };

    handleOAuthCallback();
  }, [router]);

  return <p className="text-white">로그인 처리 중입니다...</p>;
}
