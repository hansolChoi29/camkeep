"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import SplashScreen from "./SplashScreen";
import Header from "../../widgets/Header";
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

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) =>
      setSession(session)
    );
    return () => listener.subscription.unsubscribe();
  }, [setSession]);

  if (loading) return <SplashScreen />;

  if (pathname === "/auth/login" || pathname === "/auth/register") {
    return (
      <main className="flex min-h-screen justify-center items-center bg-[#FFAB5B]">
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
