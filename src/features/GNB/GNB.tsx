"use client";
import { usePathname } from "next/navigation";
import { gnbItems } from "./gnbData";
import GNBItem from "./GNBItem";

export default function GNB() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 w-full h-16 bg-[#B6A28E] border-t
        flex justify-around items-center z-40  
        sm:hidden"
    >
      {gnbItems.map((item) => (
        <GNBItem key={item.href} {...item} active={pathname === item.href} />
      ))}
    </nav>
  );
}
