"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CATEGORIES, Category } from "@/features/equipment-list/equipment-data";
import EquipmentNav from "@/features/equipment-list/equipment-nav";
import EquipmentSearch from "@/features/equipment-list/equipment-search";

interface NaverItem {
  title: string;
  link: string;
  image: string;
  lprice: string;
  mallName: string;
}

export default function EquipmentListClient() {
  const [data, setData] = useState<Record<string, NaverItem[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Category>(CATEGORIES[0].label);
  const [search, setSearch] = useState("");

  // 정렬
  const [sortBy, setSortBy] = useState<
    "popular" | "newest" | "priceHigh" | "priceLow"
  >("popular");

  // 데이터
  useEffect(() => {
    (async () => {
      const result: Record<string, NaverItem[]> = {};
      for (const { label: cat } of CATEGORIES) {
        try {
          const res = await fetch(
            `/api/shop?query=${encodeURIComponent("캠핑 " + cat)}&display=30`
          );
          if (!res.ok) throw new Error(`${res.status}`);
          const json = await res.json();
          result[cat] = json.items || [];
        } catch (e: unknown) {
          // e를 Error인지 확인하고, 아니면 문자열화
          const message = e instanceof Error ? e.message : String(e);
          result[cat] = [];
          setErrors((prev) => ({ ...prev, [cat]: message }));
        }
      }
      setData(result);
      setLoading(false);
    })();
  }, []);

  const list = useMemo(() => {
    let arr = data[selected] ?? [];

    // 검색 필터
    if (search) {
      const term = search.trim().toLowerCase();
      arr = arr.filter((i) =>
        i.title
          .replace(/<[^>]+>/g, "")
          .toLowerCase()
          .includes(term)
      );
    }

    // 정렬
    switch (sortBy) {
      case "priceHigh":
        arr = [...arr].sort((a, b) => Number(b.lprice) - Number(a.lprice));
        break;
      case "priceLow":
        arr = [...arr].sort((a, b) => Number(a.lprice) - Number(b.lprice));
        break;
      case "newest":
        // API가 최신순으로 내려준다고 가정 → 명시적으로 반환
        break;
      case "popular":
      // API가 인기순으로 내려준다고 가정 → 명시적으로 반환
      // 이것들 메타데이터 있어야 함
      default:
        break;
    }

    return arr;
  }, [data, selected, search, sortBy]);

  if (loading) return <p className="p-6 text-center">로딩중…</p>;

  return (
    <section className="sm:m-10">
      <EquipmentNav
        selected={selected}
        setSelected={setSelected}
        setSearch={setSearch}
      />

      <div className=" mt-4  flex items-baseline justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2 mt-4">{selected}</h2>
          <span className="text-sm  mb-2">총 {list.length}개</span>
        </div>
        <div>
          <EquipmentSearch
            search={search}
            selected={selected}
            setSearch={setSearch}
          />
        </div>
        {/* 정렬 */}
        <div className="mb-4 flex items-center gap-2  justify-end ">
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="border text-[#724E2B] border-[#B6A28E] rounded px-2 py-1"
          >
            <option value="popular">인기순</option>
            <option value="newest">최신순</option>
            <option value="priceHigh">가격 높은순</option>
            <option value="priceLow">가격 낮은순</option>
          </select>
        </div>
      </div>

      {errors[selected] ? (
        <p className=" text-red-600">조회 실패: {errors[selected]}</p>
      ) : list.length > 0 ? (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 ">
          {list.map((item, i) => (
            <li
              key={i}
              className="border sm:flex-row border-[#E07B39] rounded-lg overflow-hidden flex flex-col bg-white"
            >
              <div className="relative w-64 sm:w-[240px] sm:h-52  h-30">
                <Image
                  src={item.image}
                  alt={item.title.replace(/<[^>]*>/g, "")}
                  // fill
                  className="object-cover sm:w-[240px] sm:h-[220px]"
                  width={159}
                  height={80}
                />
              </div>
              <div className="px-2 sm:w-[172px] w-38 flex-1 flex flex-col justify-between">
                <div className="flex items-center justify-end">
                  <button className="py-1 text-[#724E2B] text-[10px] sm:text-xs">
                    {"<"} 자세히 보기
                  </button>
                </div>
                <h3
                  className="sm:text-sm text-sm font-semibold line-clamp-2 text-[#724E2B]"
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
                <p className="mb-1 pt-1 sm:text-sm text-xs text-[#724E2B]">
                  {item.mallName}
                </p>
                <hr />
                <p className="mt-2 sm:text-xl flex text-[#724E2B] justify-end text-sm font-bold">
                  {item.lprice}원
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-2 text-gray-500">등록된 상품이 없습니다.</p>
      )}
    </section>
  );
}
