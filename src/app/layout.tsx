import "./globals.css";
import { Metadata } from "next";
import { Luckiest_Guy } from "next/font/google";
import ClientLayout from "@/app/_components/ClientLayout";
import { Providers } from "./_components/Providers";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
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
  const supabaseServer = createServerComponentClient({ cookies });
  const {
    data: { session: initialSession },
  } = await supabaseServer.auth.getSession();

  return (
    <html lang="ko" className={luckiest.variable}>
      <body className="min-h-screen flex items-center justify-center px-4   sm:px-0 bg-[#F1EFEC] ">
        {/* QueryClientProvider 는 클라이언트 전용 컴포넌트라서, App Router의 RootLayout(서버 컴포넌트)에 바로 감싸 두면 에러 남. */}
        <Providers initialSession={initialSession}>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
