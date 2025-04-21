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
      <body className="bg-[#F5F5DC]">
        {/* QueryClientProvider 는 클라이언트 전용 컴포넌트라서, App Router의 RootLayout(서버 컴포넌트)에 바로 감싸 두면 에러 남. */}
        <Providers>
          <ClientLayout>
            <div className="mt-44 sm:max-w-[560px] mx-auto px-4">
              {/* 현업에서는 GNB(Global Navigation Bar)를 고정(fixed) 시키는 경우가 많음 
            auth화면에서 GNB보이면 안됨 CLientLayout으로 빼서 분기만들어줌
            */}
              {children}
            </div>
          </ClientLayout>
        </Providers>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
