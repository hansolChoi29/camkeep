"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";
import { gnbItems } from "../features/GNB/gnbData";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-[#E07B39] z-50 flex items-center justify-between px-4">
      <h1 className="logo text-[32px]">CAMKEEP</h1>

      <button
        className="hidden sm:block text-white"
        onClick={() => setOpen((v) => !v)}
        aria-label="메뉴 열기"
      >
        {open ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
      </button>

      {open && (
        <div
          className="
            fixed top-16 right-4 w-40 bg-white shadow-lg rounded-md
            flex flex-col divide-y
            sm:flex               /* sm 이상에서만 표시 */
            sm:divide-gray-200
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
        </div>
      )}
    </header>
  );
}
