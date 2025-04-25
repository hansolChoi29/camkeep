import Link from "next/link";
import Image from "next/image";
import { GNBItemData } from "@/types/gnbtype";

interface ButtonItemProps extends Omit<GNBItemData, "href"> {
  onClick: () => void;
  className?: string;
}

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
            ? "text-[#3D3D3D] border  border-[#3D3D3D] rounded-sm p-1"
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
  className = "",
}: ButtonItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-12 h-12 ${className}`}
    >
      <Image src={img} alt={label} width={30} height={30} />
      <span className="text-[12px]">{label}</span>
    </button>
  );
}

export default {
  Link: LinkItem,
  Button: ButtonItem,
};
