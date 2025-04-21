import * as React from "react";

export type SortOption = "popular" | "newest" | "priceHigh" | "priceLow";

interface SortProps {
  sortBy: SortOption;
  setSortBy: React.Dispatch<React.SetStateAction<SortOption>>;
}

export default function EquipmentSort({ sortBy, setSortBy }: SortProps) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <label htmlFor="sort" className="font-medium">
        정렬:
      </label>
      <select
        id="sort"
        value={sortBy}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setSortBy(e.target.value as SortOption)
        }
        className="border text-[#724E2B] border-[#B6A28E] rounded px-2 py-1"
      >
        <option value="popular">인기순</option>
        <option value="newest">최신순</option>
        <option value="priceHigh">가격 높은순</option>
        <option value="priceLow">가격 낮은순</option>
      </select>
    </div>
  );
}
