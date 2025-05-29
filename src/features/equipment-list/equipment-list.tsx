"use client";

import { useState } from "react";
import Image from "next/image";
import { NaverItem } from "@/app/equipment-list/components/equipmentList.client";
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
        <ul
          className="grid gap-4
               grid-cols-2        /* 기본(모바일): 2열 */
               sm:grid-cols-3     /* sm 이상: 3열 */
               md:grid-cols-4     /* md 이상: 4열 */
               lg:grid-cols-5     /* lg 이상: 5열 */
               xl:grid-cols-6     /* xl 이상: 6열 */
               2xl:grid-cols-8    /* 2xl 이상: 8열 */"
        >
          {list.map((item, i) => (
            <li
              key={i}
              className="
                     w-full flex flex-col items-center
        rounded-lg overflow-hidden
        shadow-[4px_4px_4px_rgba(0,0,0,0.25)]
        transform hover:-translate-y-1
        transition-all duration-200"
            >
              <Image
                src={item.image}
                alt={item.title.replace(/<[^>]*>/g, "")}
                width={159}
                height={80}
                sizes="(max-width: 640px) 100vw, 20rem"
                className="object-cover w-full"
              />

              <div className="px-2 sm:w-43 w-38 flex-1 flex flex-col justify-between">
                <h3
                  className="sm:text-sm pt-1 text-sm font-semibold line-clamp-2 text-black"
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
                <p className="mb-1 pt-1 sm:text-sm text-xs text-black">
                  {item.mallName}
                </p>
                <div className="flex items-center justify-end">
                  <button
                    className="py-1 text-black text-xs"
                    onClick={() => openModal(item)}
                  >
                    &lt; 자세히 보기
                  </button>
                </div>
                <hr />
                <div className=" p-1 sm:text-xl flex items-center  justify-end text-sm font-bold text-black">
                  <p className=" text-sm pr-2">최저가</p>
                  <p className="">{item.lprice}원</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-2 text-gray-500">새로고침 해주세요.</p>
      )}

      <EquipmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        item={currentItem}
      />
    </>
  );
}
