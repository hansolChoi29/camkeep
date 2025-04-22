"use client";
import { Category } from "@/features/equipment-list";
import NewbieGuideNav from "@/features/newbie-guide/newbie-guide-nav";
import { CATEGORIES } from "@/features/newbie-guide/newbie-quide-data";
import { useState } from "react";

export type GuideCategory = (typeof CATEGORIES)[number]["label"];

export default function NewbieGuidClient() {
  const [selected, setSelected] = useState<GuideCategory>(CATEGORIES[0].label);
  const [search, setSearch] = useState("");

  const current = CATEGORIES.find((c) => c.label === selected);

  return (
    <section>
      <article>
        <div className="flex justify-center my-12">
          <h1 className="text-[#724E2B] font-extrabold text-2xl">
            초보자 가이드
          </h1>
        </div>

        <div className="bg-[#DCE4C9] rounded-t-sm flex flex-col  items-center justify-center w-auto h-32">
          <hr />
          <NewbieGuideNav
            selected={selected}
            setSelected={setSelected}
            setSearch={setSearch}
          />
        </div>
      </article>

      <article className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-[#E07B39]">
          {current?.label}
        </h2>
        <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {current?.text}
        </p>
      </article>
    </section>
  );
}
