"use client";

import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, Category } from "@/features/equipment-list/equipment-data";
import EquipmentNav from "@/features/equipment-list/equipment-nav";
import EquipmentSearch from "@/features/equipment-list/equipment-search";
import EquipmentSort from "@/features/equipment-list/equipment-sort";
import EauipmentList from "@/features/equipment-list/equipment-list";

export interface NaverItem {
  title: string;
  link: string;
  image: string;
  lprice: number; // 최저가
  hprice?: number; // 최고가 (선택)
  mallName: string; // 쇼핑몰 이름
  productId: string; // 상품 고유 ID
  productType: string; // 상품 타입 ("1"=일반, "2"=렌탈)

  brand?: string; // 브랜드
  maker?: string; // 제조사
  category1?: string; // 대분류
  category2?: string; // 중분류
  category3?: string; // 소분류
  category4?: string; // 세분류
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

      <EquipmentSearch
        search={search}
        selected={selected}
        setSearch={setSearch}
      />
      <div className="sm:ml-8 mt-4 flex items-center justify-between">
        {/* 왼쪽 그룹: 제목 + 개수 */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <h2 className="text-[#030303] sm:text-xl text-xs font-bold mr-4 mb-1 sm:mb-0">
            {selected}
          </h2>
          <span className="text-sm text-[#030303]">총 {list.length}개</span>
        </div>

        {/* 오른쪽 정렬 컴포넌트 */}
        <EquipmentSort sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      <EauipmentList selected={selected} list={list} errors={errors} />
    </section>
  );
}
