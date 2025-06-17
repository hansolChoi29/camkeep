"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import HomeCampingMonth from "@/features/home/home-camping-month";
import MenuIcon from "@/features/menu/menui-icon";
import { useAuthStore } from "@/store/useAuthStore";

export default function Header() {
  const { isLoggedIn } = useAuthStore();
  const pathname = usePathname();
  const isMainPage = pathname === "/";

  const navClass = (href: string) =>
    `${
      pathname === href ? "text-red-500" : "text-[#578E7E]"
    } transition-colors hover:text-red-500`;

  return (
    <>
      <header className="fixed w-full top-0 h-16 bg-white shadow-md z-50 flex items-center px-4">
        <Link
          href="/"
          className="text-3xl font-bold text-[#578E7E] transition-transform hover:scale-110 hover:text-red-500"
        >
          CAMKEEP
        </Link>

        <div className="flex-1" />

        <div className="flex items-center space-x-4">
          <Link href="/camping" className={navClass("/camping")}>
            캠핑장
          </Link>
          <Link href="/equipment-list" className={navClass("/equipment-list")}>
            용품샵
          </Link>
          <Link href="/community" className={navClass("/community")}>
            커뮤니티
          </Link>
          <Link href="/check-list" className={navClass("/check-list")}>
            체크리스트
          </Link>

          {isLoggedIn ? (
            <Link href="/mypage" className={navClass("/mypage")}>
              마이페이지
            </Link>
          ) : (
            !isMainPage && (
              <>
                <Link href="/auth/login" className={navClass("/auth/login")}>
                  로그인
                </Link>
                <Link
                  href="/auth/register"
                  className={navClass("/auth/register")}
                >
                  회원가입
                </Link>
              </>
            )
          )}

          <Link href="/newbie-guide" className="transform hover:scale-110">
            <Image
              src="/images/header-newbie.png"
              alt="Newbie Guide"
              width={40}
              height={32}
            />
          </Link>
          <MenuIcon />
        </div>
      </header>
      <HomeCampingMonth />
    </>
  );
}
