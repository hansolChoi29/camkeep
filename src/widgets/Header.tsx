"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";
import { gnbItems } from "../features/GNB/gnbData";
import Image from "next/image";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="
    fixed top-0 left-0 w-full h-16 bg-[#E07B39] z-50
   flex items-center justify-center sm:justify-start /* 로고 중앙 */
    px-4
  "
    >
      <Link href="/">
        <h1 className="logo text-[32px] hover:text-white  transform transition-transform duration-200 ease-in-out hover:scale-110">
          CAMKEEP
        </h1>
      </Link>

      {/* 오른쪽 버튼 그룹: 절대 위치로 배치 */}
      <div className="absolute right-4 flex items-center space-x-4">
        {/* 초보자가이드 버튼 (항상 보임) */}
        <Link
          href="/newbie-guide"
          className="transform transition-transform duration-200 ease-in-out hover:scale-110"
        >
          <Image
            src="/images/header-newbie.png"
            alt="Newbie Guide"
            width={40}
            height={32}
            className="object-contain"
          />
        </Link>

        {/* 메뉴 토글 버튼 (PC에서만 보임) */}
        <button
          className="hidden sm:block text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        >
          {open ? <CloseIcon size={30} /> : <MenuIcon size={30} />}
        </button>
      </div>

      {/* PC 전용 드롭다운 메뉴 */}
      {open && (
        <nav
          className="
        hidden sm:flex
        fixed top-16 right-4 w-40
        bg-white shadow-lg rounded-md
        flex-col divide-y divide-gray-200
        z-50
      "
        >
          {gnbItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 hover:bg-gray-100 logo text-[18px]"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
