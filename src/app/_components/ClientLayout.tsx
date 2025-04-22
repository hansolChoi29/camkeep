"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import GNB from "@/features/GNB/GNB";
import SplashScreen from "./SplashScreen";
import Header from "../../widgets/Header";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabaseClient";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(t);
  }, []);
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    // 1) 브라우저 localStorage가 복원한 Zustand 상태와 supabase 세션을 싱크
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2) 이후 로그인/로그아웃 이벤트도 스토어에 반영
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setSession]);
  if (loading) return <SplashScreen />;

  if (pathname === "/auth/login") {
    return (
      <main className="flex min-h-screen w-full bg-[#FFAB5B] justify-center items-center">
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
