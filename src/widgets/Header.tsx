"use client";

import Link from "next/link";
import Image from "next/image";
import HomeCampingMonth from "@/features/home/home-camping-month";
import MenuIcon from "@/features/menu/menui-icon";

export default function Header() {
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
