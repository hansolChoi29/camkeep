"use client";

import { useState } from "react";
import Image from "next/image";
import { NaverItem } from "@/app/equipment-list/_components/equipmenList.client";
import EquipmentModal from "./equipment-modal";

interface EquipmentListProps {
  selected: string;
  list: NaverItem[];
  errors: Record<string, string>;
}

export default function EquipmentList({
  selected,
  list,
  errors,
}: EquipmentListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<NaverItem | null>(null);

  const openModal = (item: NaverItem) => {
    setCurrentItem(item);
    setModalOpen(true);
  };

  return (
    <>
      {errors[selected] ? (
        <p className="text-red-600">조회 실패: {errors[selected]}</p>
      ) : list.length > 0 ? (
        <ul className="flex flex-wrap gap-2 justify-center">
          {list.map((item, i) => (
            <li
              key={i}
              className="
                border w-40 h-auto flex flex-col items-center
                sm:w-80 border-[#504B38] rounded-lg overflow-hidden bg-white
              "
            >
              <Image
                src={item.image}
                alt={item.title.replace(/<[^>]*>/g, "")}
                width={159}
                height={80}
                sizes="(max-width: 640px) 100vw, 20rem"
                className="object-cover w-full sm:w-80 lg:w-96"
              />

              <div className="px-2 sm:w-43 w-38 flex-1 flex flex-col justify-between">
                <h3
                  className="sm:text-sm text-sm font-semibold line-clamp-2 text-[#724E2B]"
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
                <p className="mb-1 pt-1 sm:text-sm text-xs text-[#724E2B]">
                  {item.mallName}
                </p>
                <div className="flex items-center justify-end">
                  <button
                    className="py-1 text-[#724E2B] text-xs"
                    onClick={() => openModal(item)}
                  >
                    &lt; 자세히 보기
                  </button>
                </div>
                <hr />
                <p className="mt-2 sm:text-xl flex justify-end text-sm font-bold text-[#724E2B]">
                  {item.lprice}원
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-2 text-gray-500">등록된 상품이 없습니다.</p>
      )}

      <EquipmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={currentItem}
      />
    </>
  );
}
