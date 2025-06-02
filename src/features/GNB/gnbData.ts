import TentIcon from "./icons/TentIcon";
import EquipmentIcon from "./icons/EquipmentIcon";
import CommuIcon from "./icons/CommuIcon";
import ChecklistIcon from "./icons/ChecklistIcon";
import MypageIcon from "./icons/MypageIcon";
import type { GNBItemData } from "@/types/gnbtype";

export const gnbItems: GNBItemData[] = [
  {
    id: "camping",
    label: "캠핑장",
    href: "/camping",
    Icon: TentIcon,
  },
  {
    id: "shop",
    label: "용품샵",
    href: "/equipment-list",
    Icon: EquipmentIcon,
  },
  {
    id: "community",
    label: "커뮤니티",
    href: "/community",
    Icon: CommuIcon,
  },
  {
    id: "checklist",
    label: "체크리스트",
    href: "/check-list",
    Icon: ChecklistIcon,
  },
  {
    id: "mypage",
    label: "마이페이지",
    href: "/mypage",
    Icon: MypageIcon,
  },
];
