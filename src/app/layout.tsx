import "./globals.css";
import { Metadata } from "next";
import { Luckiest_Guy } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import GNB from "@/components/GNB";
// import Footer from "@/components/Footer";

const luckiest = Luckiest_Guy({
  subsets: ["latin"], // Luckiest Guy는 영문 전용
  weight: ["400"], // 지원하는 weight
  display: "swap",
  variable: "--font-logo", // CSS 변수 이름
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
        <ClientLayout>
          <div className="w-full sm:max-w-[560px] mx-auto px-4">
            {/* 현업에서는 GNB(Global Navigation Bar)를 고정(fixed) 시키는 경우가 많음 */}
            {children}
          </div>
        </ClientLayout>
        <GNB />
        {/* <Footer /> */}
      </body>
    </html>
  );
}
