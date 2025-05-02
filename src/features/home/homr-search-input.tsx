"use client";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

export default function HomeSearchInput() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex">
      <Input />

      <button
        className="ml-4 p-1 text-gray-600 hover:text-gray-800 sm:ml-6"
        onClick={() => setSearchOpen((v) => !v)}
        aria-label={searchOpen ? "검색닫기" : "검색열기"}
      >
        {searchOpen ? <SearchIcon size={24} /> : <SearchIcon size={24} />}
      </button>
      {searchOpen && (
        <div className="absolute top-16 inset-x-0 bg-white px-4 py-2 shadow-md sm:hidden">
          <Input placeholder="검색어를 입력하세요…" autoFocus />
        </div>
      )}
    </div>
  );
}
