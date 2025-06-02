import Link from "next/link";
import React from "react";
import type { GNBItemData } from "@/types/gnbtype";

interface LinkItemProps extends GNBItemData {
  active: boolean;
  className?: string;
}

export function LinkItem({
  label,
  href,
  Icon,
  active,
  className = "",
}: LinkItemProps) {
  return (
    <Link
      href={href}
      className={`
        flex flex-col items-center w-20
        ${
          active ? "text-[#578E7E]  p-1" : "text-[#1F1F1F] hover:text-[#578E7E]"
        }
        ${className}
      `}
    >
      <Icon width={30} height={30} />
      <span className="text-[12px]">{label}</span>
    </Link>
  );
}

interface ButtonItemProps {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
  className?: string;
}

export function ButtonItem({ Icon, onClick, className = "" }: ButtonItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-12 h-12 ${className}`}
    >
      <Icon width={30} height={30} />
    </button>
  );
}

export default {
  Link: LinkItem,
  Button: ButtonItem,
};
