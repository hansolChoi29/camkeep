import Link from "next/link";
import Image from "next/image";
import { GNBItemData } from "../../../types/gnbtype";

export default function GNBItem({ label, href, img, active }: GNBItemData) {
  return (
    <Link
      href={href}
      className={`
        flex flex-col items-center w-20
        ${
          active
            ? "text-white border border-white rounded-sm p-1"
            : "text-white"
        }
      `}
    >
      <Image src={img} alt={label} width={30} height={30} />
      <span className="text-[12px]">{label}</span>
    </Link>
  );
}
