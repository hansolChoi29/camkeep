// src/features/GNB/GNBItem.tsx
import Link from "next/link";
import Image from "next/image";
import { GNBItemData } from "@/types/gnbtype";

export function LinkItem({
  label,
  href,
  img,
  active,
}: GNBItemData & { active: boolean }) {
  return (
    <Link
      href={href}
      className={`
        flex flex-col items-center w-20
        ${
          active
            ? "text-[#3D3D3D] border border-[#3D3D3D] rounded-sm p-1"
            : "text-black"
        }
      `}
    >
      <Image src={img} alt={label} width={30} height={30} />
      <span className="text-[12px]">{label}</span>
    </Link>
  );
}

export function ButtonItem({
  label,
  img,
  onClick,
}: Omit<GNBItemData, "href"> & { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center w-20 text-black"
    >
      <Image src={img} alt={label} width={30} height={30} />
      <span className="text-[12px]">{label}</span>
    </button>
  );
}

// 재내보내기
export default {
  Link: LinkItem,
  Button: ButtonItem,
};
