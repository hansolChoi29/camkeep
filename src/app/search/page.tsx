"use client";

import Link from "next/link";
import Image from "next/image";
import { fetchCampingList, CampingItem, Camp } from "@/lib/camping";
import { useState, useEffect, useMemo, FormEvent } from "react";

export default function SearchPage() {
  // 1) 검색어 상태
  const [query, setQuery] = useState("");
  // 2) API로 가져온 캠핑장들
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loading, setLoading] = useState(false);

  // 3) query가 바뀔 때마다 fetch
  useEffect(() => {
    if (!query) {
      setCamps([]);
      return;
    }
    setLoading(true);
    (async () => {
      try {
        const raw: CampingItem[] = await fetchCampingList(query, 1, 20);
        const mapped: Camp[] = raw.map((item) => ({
          id: item.contentId.toString(),
          name: item.facltNm,
          address: item.addr1,
          img: item.firstImageUrl,
        }));
        setCamps(mapped);
      } catch (e) {
        console.error("캠핑장 검색 실패:", e);
        setCamps([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [query]);

  // 4) 추가 필터(예: 부분 일치) 필요 없으면 이 부분을 바로 camps로 쓰셔도 됩니다
  const filtered = useMemo(() => {
    if (!query.trim()) return camps;
    return camps.filter((c) =>
      c.name.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [camps, query]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // 현재는 입력할 때마다 query가 갱신되니 여기선 따로 할 일이 없습니다
    // 만약 "엔터 → 검색 실행" 구조를 원하시면,
    // query와 input 상태를 분리하고 onSubmit에서 query를 setQuery(inputValue) 하면 됩니다.
  };

  if (loading) return <p className="p-4 text-center">로딩 중…</p>;

  return (
    <main className="max-w-5xl mx-auto p-4 space-y-6">
      {/* 검색폼 */}
      <form onSubmit={onSubmit} className="flex justify-center mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="캠핑장 이름으로 검색하세요"
          className="w-full max-w-xs px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#578E7E]"
        />
      </form>

      {/* 검색 결과 */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">
          “{query}” 검색 결과가 없습니다.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((camp) => (
            <li key={camp.id}>
              <Link
                href={`/camping/${camp.id}`}
                className="block overflow-hidden rounded-lg shadow hover:shadow-lg transition"
              >
                {camp.img ? (
                  <div className="relative w-full h-48">
                    <Image
                      src={camp.img}
                      alt={camp.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-semibold mb-1">{camp.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {camp.address}
                  </p>
                  <p className="mt-2 text-sm text-[#578E7E] font-medium">
                    자세히 보기 →
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
