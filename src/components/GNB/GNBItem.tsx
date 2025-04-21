import Link from "next/link";
import Image from "next/image";
import { GNBItemData } from "./type";

export default function GNBItem({ label, href, img, active }: GNBItemData) {
  return (
    <Link
      href={href}
      className={`
        flex flex-col items-center
        ${active ? "text-[#E07B39] font-bold" : "text-gray-600"}
      `}
    >
      <Image src={img} alt={label} width={24} height={24} />
      <span className="text-[12px] font-bold">{label}</span>
    </Link>
  );
}
