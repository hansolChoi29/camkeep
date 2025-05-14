"use client";
import NewbieGuideNav from "@/features/newbie-guide/newbie-guide-nav";
import { CATEGORIES } from "@/features/newbie-guide/newbie-quide-data";
import { useState } from "react";

export type GuideCategory = (typeof CATEGORIES)[number]["label"];

export default function NewbieGuidClient() {
  const [selected, setSelected] = useState<GuideCategory>(CATEGORIES[0].label);
  const [search, setSearch] = useState("");
  console.log("search", search);
  const current = CATEGORIES.find((c) => c.label === selected);

  return (
    <section>
      <article>
        <div className="flex justify-center my-12 ">
          <h1 className="text-[#578E7E] font-extrabold text-2xl main">
            초보자 가이드
          </h1>
        </div>

        <div className="bg-[#578E7E]  rounded-t-sm flex flex-col  items-center justify-center w-auto h-32 main ">
          <hr />
          <NewbieGuideNav
            selected={selected}
            setSelected={setSelected}
            setSearch={setSearch}
          />
        </div>
      </article>

      <article className="bg-white p-6 rounded shadow main">
        <h2 className="text-2xl font-semibold mb-4 text-[#578E7E]">
          {current?.label}
        </h2>
        <p className="whitespace-pre-wrap sm:text-2xl text-gray-800 leading-relaxed">
          {current?.text}
        </p>
      </article>
    </section>
  );
}
