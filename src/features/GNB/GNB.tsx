"use client";

import { usePathname } from "next/navigation";
import type { GNBItemData } from "@/types/gnbtype";
import { gnbItems } from "./gnbData";
import GNBItem from "./GNBItem";

type Props = {
  onCommunityClick: () => void;
};

export default function GNB({ onCommunityClick }: Props) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 border-t flex justify-around items-center z-40 shadow-inner bg-white p-4 sm:hidden">
      {gnbItems.map((item: GNBItemData) => {
        const isActive = pathname === item.href;

        if (pathname === "/community" && item.id === "community") {
          return (
            <GNBItem.Button
              key={item.id}
              Icon={item.Icon}
              onClick={onCommunityClick}
              className={`border rounded-full p-1 transition-all ${
                isActive ? "border-[#578E7E]" : "border-transparent"
              }`}
            />
          );
        }

        return (
          <GNBItem.Link
            key={item.id}
            id={item.id}
            label={item.label}
            href={item.href}
            Icon={item.Icon}
            active={isActive}
          />
        );
      })}
    </nav>
  );
}
