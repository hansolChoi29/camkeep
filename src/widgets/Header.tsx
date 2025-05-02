// src/app/components/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gnbItems } from "@/features/GNB/gnbData";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full h-16 bg-white shadow-md z-50 flex items-center px-4">
      {/* 로고 */}
      <Link
        href="/"
        className="text-3xl font-bold text-[#578E7E] hover:text-[#3D3D3D] transition-transform hover:scale-110"
      >
        CAMKEEP
      </Link>

      <nav className="hidden sm:flex flex-1 justify-center space-x-6">
        {gnbItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center space-x-1 text-sm font-medium text-[#578E7E] hover:text-[#3D3D3D] transition-colors"
          >
            <Image src={item.img} alt={item.label} width={20} height={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="flex-1" />

      {/* 모바일 → GNB 토글 버튼(sm 이하) & Newbie Guide */}
      <div className="flex items-center space-x-4">
        <Link href="/newbie-guide" className="transform hover:scale-110">
          <Image
            src="/images/header-newbie.png"
            alt="Newbie Guide"
            width={40}
            height={32}
          />
        </Link>
        {/* 햄버거/닫기 버튼: PC(≥sm)에서는 숨김 */}
      </div>

      {/* 모바일 전용 드롭다운 GNB (sm 이하) */}
      {open && (
        <nav className="absolute top-16 left-0 w-full bg-white shadow-lg sm:hidden flex flex-col divide-y divide-gray-200 z-50">
          {gnbItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 flex items-center space-x-2 text-[#578E7E] hover:bg-gray-100"
            >
              <Image src={item.img} alt={item.label} width={20} height={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
