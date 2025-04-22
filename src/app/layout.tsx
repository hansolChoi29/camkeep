import "./globals.css";
import { Metadata } from "next";
import { Luckiest_Guy } from "next/font/google";
import ClientLayout from "@/app/_components/ClientLayout";
import { Providers } from "./_components/Providers";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={luckiest.variable}>
      <body className="bg-[#F5F5DC] flex flex-col min-h-screen">
        {/* QueryClientProvider 는 클라이언트 전용 컴포넌트라서, App Router의 RootLayout(서버 컴포넌트)에 바로 감싸 두면 에러 남. */}
        <Providers>
          <ClientLayout>
            <div className="flex-1 overflow-auto mt-20 max-w-[560px] sm:max-w-none mx-auto px-4 pb-16">
              {children}
            </div>
          </ClientLayout>
        </Providers>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
