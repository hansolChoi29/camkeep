"use client";

import { usePathname } from "next/navigation";
import { gnbItems } from "./gnbData";
import GNBItem from "./GNBItem";

type Props = {
  onCommunityClick: () => void;
};

export default function GNB({ onCommunityClick }: Props) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 border-t flex justify-around items-center z-40 shadow-inner bg-white p-4 sm:hidden">
      {gnbItems.map((item) => {
        // 1) 현재 /community 경로이고, 이 아이템이 id === 'community' 라면
        if (pathname === "/community" && item.id === "community") {
          return (
            <GNBItem.Button
              key={item.id}
              id={item.id}
              label="새 글 작성" // 버튼 텍스트 변경
              img="/images/menu-community.png" // 원하는 아이콘으로 바꿔도 OK
              onClick={onCommunityClick} // 모달 열기 핸들러
            />
          );
        }

        // 2) 그 외의 경우는 기존대로 Link
        return (
          <GNBItem.Link
            key={item.id}
            {...item}
            active={pathname === item.href}
          />
        );
      })}
    </nav>
  );
}
