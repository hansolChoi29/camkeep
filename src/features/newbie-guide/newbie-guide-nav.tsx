"use client";

import { CATEGORIES } from "./newbie-quide-data";
import { GuideCategory } from "@/app/newbie-guide/_components/newbie-guide.client";

interface NewbieGuideNavProps {
  selected: GuideCategory;
  setSelected: React.Dispatch<React.SetStateAction<GuideCategory>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}
export default function NewbieGuideNav({
  selected,
  setSelected,
  setSearch,
}: NewbieGuideNavProps) {
  return (
    <nav className="flex flex-wrap ">
      {CATEGORIES.map(({ label }) => (
        <button
          key={label}
          className={`flex-shrink-0 px-2 py-1 m-1 rounded-full  transition-colors whitespace-nowrap 
            ${
              selected === label
                ? "bg-[#E07B39] text-white border-transparent"
                : " text-gray-800 border-gray-300 hover:bg-gray-100"
            }
          `}
          onClick={() => {
            setSelected(label);
            setSearch("");
          }}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
