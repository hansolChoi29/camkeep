"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gnbItems } from "@/features/GNB/gnbData";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 h-16 bg-white shadow-md z-50 flex items-center px-4">
      <Link
        href="/"
        className="text-3xl font-bold text-[#578E7E] hover:text-[#3D3D3D] transition-transform hover:scale-110"
      >
        CAMKEEP
      </Link>

      <nav className="hidden sm:flex flex-1 justify-center space-x-6 flex-nowrap ml-2">
        {gnbItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="
        text-xl flex items-center space-x-1 font-medium 
        text-[#578E7E] hover:text-[#3D3D3D] transition-colors
        whitespace-nowrap  /* 글자 줄 바꿈 방지 */
      "
          >
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="flex items-center space-x-4">
        <Link href="/newbie-guide" className="transform hover:scale-110">
          <Image
            src="/images/header-newbie.png"
            alt="Newbie Guide"
            width={40}
            height={32}
          />
        </Link>
      </div>

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
