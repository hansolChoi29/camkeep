import "./globals.css";
import { Metadata } from "next";
import { Luckiest_Guy } from "next/font/google";
import ClientLayout from "@/app/components/ClientLayout";
import { serverSupabase } from "@/lib/supabase/server";
import { Providers } from "./components/Providers";
// import Footer from "@/components/Footer";

const luckiest = Luckiest_Guy({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-logo",
});

export const metadata: Metadata = {
  title: "Camkeep",
  description: "캠핑장 정보 앱",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = serverSupabase();
  const {
    data: { session: initialSession },
  } = await supabase.auth.getSession();

  return (
    <html lang="ko" className={luckiest.variable}>
      <body className="min-h-screen flex flex-col px-0 lg:px-44">
        {/* QueryClientProvider 는 클라이언트 전용 컴포넌트라서, App Router의 RootLayout(서버 컴포넌트)에 바로 감싸 두면 에러 남. */}
        <Providers initialSession={initialSession}>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
