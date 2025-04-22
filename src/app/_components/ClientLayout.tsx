"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import GNB from "@/features/GNB/GNB";
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
    const t = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(t);
  }, []);

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
