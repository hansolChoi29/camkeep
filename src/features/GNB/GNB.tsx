"use client";
import { usePathname } from "next/navigation";
import { gnbItems } from "./gnbData";
import GNBItem from "./GNBItem";

export default function GNB() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 w-full h-16  border-t
        flex justify-around items-center z-40 inner-shadow-300 shadow-inner bg-white p-4 
        sm:hidden"
    >
      {gnbItems.map((item) => (
        <GNBItem key={item.href} {...item} active={pathname === item.href} />
      ))}
    </nav>
  );
}
