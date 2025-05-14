"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { CampingItem, fetchAllCampingList } from "@/lib/camping";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CampingClient() {
  const [list, setList] = useState<CampingItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1) 전체 데이터 로드

  useEffect(() => {
    fetch("/api/go-camping?pageNo=1")
      .then((res) => res.json())
      .then((data: CampingItem[]) => setList(data))
      .catch((e) => {
        console.error("🛑 /api/go-camping fetch 실패", e);
        setError("캠핑장 데이터를 불러올 수 없습니다");
      })
      .finally(() => setIsPending(false));
  }, []);

  // 2) 주소(addr1)에 searchTerm 포함된 항목만 필터링
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return list;
    return list.filter((camp) =>
      camp.addr1.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [list, searchTerm]);

  if (isPending) return <p className="p-4 text-center">로딩중…</p>;
  if (error) return <p className="p-4 text-center text-red-600">{error}</p>;
  if (list.length === 0)
    return <p className="p-4 text-center">캠핑장 데이터가 없습니다.</p>;

  return (
    <main className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">캠핑장 목록</h1>

      {/* 검색창 */}
      <div className="flex justify-center mb-6">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="주소에 포함된 지역명으로 검색하세요"
          className="max-w-md w-full"
        />
      </div>

      {/* 카드 그리드 */}
      {filtered.length === 0 ? (
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
              {/* 이미지 */}
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

              {/* 제목 */}
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

              {/* 자세히 보기 버튼 */}
              <CardFooter className="px-4 py-2">
                <Link
                  href={`/camping/${camp.contentId}`}
                  className="text-sm text-[#578E7E] "
                >
                  자세히 보기 →
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
