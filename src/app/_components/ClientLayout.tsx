"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

import GNB from "@/features/GNB/ui/GNB";
import SplashScreen from "./SplashScreen";
import Header from "../../widgets/Header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SplashScreen />;

  if (pathname === "/auth/login") {
    return (
      <SessionProvider>
        <main className="flex min-h-screen w-full bg-[#FFAB5B] justify-center items-center">
          {children}
        </main>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <Header />

      <div className="w-full sm:max-w-[560px] mx-auto px-4">{children}</div>

      <GNB />
    </SessionProvider>
  );
}
