"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import SplashScreen from "./SplashScreen";
import Header from "@/widgets/Header";
import GNB from "@/features/GNB/GNB";
import { useAuthStore } from "@/store/useAuthStore";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const setSession = useAuthStore((s) => s.setSession);

  // 1) 스플래시
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  // 2) supabase 세션 복원 + 이벤트 리스너
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );
    return () => listener.subscription.unsubscribe();
  }, [setSession]);

  if (loading) return <SplashScreen />;

  // 로그인/회원가입 화면에서는 GNB/헤더 생략
  if (["/auth/login", "/auth/register"].includes(pathname)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFAB5B]">
        {children}
      </main>
    );
  }

  return (
    <>
      <Header />
      <div>{children}</div>
      <GNB />
    </>
  );
}
