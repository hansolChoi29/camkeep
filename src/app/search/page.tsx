"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

import { fetchAllCampingList, CampingItem } from "@/lib/camping";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function SearchPage() {
  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState("");
  // 전체 캠핑장 목록
  const [list, setList] = useState<CampingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1) 초기 데이터 로드
  useEffect(() => {
    fetchAllCampingList()
      .then((items) => setList(items))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => setLoading(false));
  }, []);

  // 2) 주소(addr1)에 검색어가 포함된 항목만 필터링
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return list;
    return list.filter((camp) =>
      camp.addr1.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [list, searchTerm]);

  return (
    <main className="space-y-12">
      <section className="max-w-6xl mx-auto p-4 space-y-4">
        <h2 className="text-2xl font-bold">캠핑장 검색</h2>

        <div className="flex justify-center">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="주소에 포함된 지역명으로 검색하세요"
            className="w-full max-w-md"
          />
        </div>

        {loading ? (
          <p className="text-center">로딩중…</p>
        ) : error ? (
          <p className="text-center text-red-600">오류: {error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500">
            “{searchTerm}” 검색 결과가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((camp) => (
              <Card
                key={camp.contentId}
                className="flex flex-col overflow-hidden"
              >
                {/* 캠핑장 이미지 */}
                {camp.firstImageUrl ? (
                  <div className="relative w-full h-40">
                    <Image
                      src={camp.firstImageUrl}
                      alt={camp.facltNm}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                    No Image
                  </div>
                )}

                {/* 캠핑장 이름 */}
                <CardHeader className="px-4 pt-4 pb-0">
                  <CardTitle className="text-base sm:text-lg">
                    {camp.facltNm}
                  </CardTitle>
                </CardHeader>

                {/* 주소 */}
                <CardContent className="px-4 py-2 flex-1">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {camp.addr1}
                  </p>
                </CardContent>

                {/* 자세히 보기 링크 */}
                <CardFooter className="px-4 py-2">
                  <Link
                    href={`/camping/${camp.contentId}`}
                    className="text-sm text-[#578E7E] hover:underline"
                  >
                    자세히 보기 →
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
