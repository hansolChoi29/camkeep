"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CampingItem, fetchAllCampingList } from "@/api/goCamping";

export default function CampingClient() {
  const [list, setList] = useState<CampingItem[]>([]);
  const [isPending, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllCampingList()
      .then(setList)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (isPending) return <p>로딩중…</p>;
  if (error) return <p>{error}</p>;
  if (list.length === 0) return <p>캠핑장 데이터가 없습니다.</p>;

  return (
    <main className="">
      <h1 className="text-base font-bold ">캠핑장 목록</h1>
      <ul className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-1">
        {list.map((camp) => (
          <li
            key={camp.contentId}
            className="flex flex-col  items-start w-[150px] h-[150px] border rounded-md overflow-hidden"
          >
            {camp.firstImageUrl ? (
              <Image
                src={camp.firstImageUrl}
                alt={camp.facltNm}
                width={180}
                height={50}
                className="w-[180px] h-[90px] object-cover"
              />
            ) : (
              <div className="w-full h-24 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                No Image
              </div>
            )}
            <div className="">
              <h2 className="text-xs font-semibold">{camp.facltNm}</h2>
              <p className="text-xs text-gray-600">{camp.addr1}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
