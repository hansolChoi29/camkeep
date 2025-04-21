"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import SplashScreen from "./SplashScreen";
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

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <>
      {/* 로그인 페이지(/login)라면 Header를 그리지 않습니다 */}
      {pathname !== "/login" && <Header />}
      {children}
    </>
  );
}
