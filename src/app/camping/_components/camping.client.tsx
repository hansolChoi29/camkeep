"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CampingItem,
  fetchCampingList,
  CampingListResponse,
} from "@/lib/camping";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CampingClient() {
  const [list, setList] = useState<CampingItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const pageSize = 20;

  useEffect(() => {
    setIsPending(true);
    setError(null);

    fetchCampingList(pageNo, pageSize)
      .then(({ items, totalCount }: CampingListResponse) => {
        setList(items);
        setTotalPages(Math.ceil(totalCount / pageSize));
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => setIsPending(false));
  }, [pageNo]);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return list;
    return list.filter((camp) =>
      camp.addr1.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [list, searchTerm]);

  if (isPending) return <p className="p-4 text-center">로딩중…</p>;
  if (error) return <p className="p-4 text-center text-red-600">{error}</p>;
  if (filtered.length === 0)
    return <p className="p-4 text-center">캠핑장 데이터가 없습니다.</p>;

  // — 페이지네이션 숫자 배열 생성 헬퍼
  function getPageRange(current: number, total: number) {
    const delta = 2; // 현재 페이지 기준 앞뒤로 몇 개씩
    const range: (number | string)[] = [];
    let lastPage = 0;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        if (lastPage && i - lastPage > 1) {
          range.push("...");
        }
        range.push(i);
        lastPage = i;
      }
    }
    return range;
  }

  const pages = getPageRange(pageNo, totalPages);

  return (
    <main className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">캠핑장 목록</h1>

      <div className="flex justify-center mb-6">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="주소에 포함된 지역명으로 검색하세요"
          className="max-w-md w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((camp) => (
          <Link
            key={camp.contentId}
            href={`/camping/${camp.contentId}`}
            className="h-full"
          >
            <Card className="h-full flex flex-col overflow-hidden transform hover:-translate-y-1 transition-all duration-200">
              <div className="relative w-full h-40">
                {camp.firstImageUrl ? (
                  <Image
                    src={camp.firstImageUrl}
                    alt={camp.facltNm}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                    <Image
                      src="/images/noimages.svg"
                      alt="noimages"
                      width={1000}
                      height={1000}
                    />
                  </div>
                )}
              </div>

              <CardHeader className="px-4 pt-4 pb-0">
                <CardTitle className="text-base sm:text-lg">
                  {camp.facltNm}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 py-2 flex-1">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {camp.addr1}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center space-x-2">
        <button
          onClick={() => setPageNo((p) => Math.max(p - 1, 1))}
          disabled={pageNo === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          이전
        </button>

        {pages.map((p, idx) =>
          typeof p === "string" ? (
            <span key={`dot-${idx}`} className="px-2">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => setPageNo(p)}
              className={`px-3 py-1 border rounded ${
                pageNo === p ? "bg-[#578E7E] text-white" : ""
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => setPageNo((p) => Math.min(p + 1, totalPages))}
          disabled={pageNo === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </main>
  );
}
