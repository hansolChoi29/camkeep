"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CampingItem } from "@/lib/camping";
import { fetchAllCampingList } from "@/lib/camping";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function CampingClient() {
  const [list, setList] = useState<CampingItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    fetchAllCampingList()
      .then((items) => {
        setList(items);
        setIsPending(false);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        setIsPending(false);
      });
  }, []);

  if (isPending) return <p className="p-4 text-center">로딩중…</p>;
  if (error) return <p className="p-4 text-center text-red-600">{error}</p>;
  if (list.length === 0)
    return <p className="p-4 text-center">캠핑장 데이터가 없습니다.</p>;

  return (
    <main className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">캠핑장 목록</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {list.map((camp) => (
          <Card key={camp.contentId} className="flex flex-col overflow-hidden">
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

            <CardHeader className="px-4 pt-4 pb-0">
              <CardTitle className="text-base sm:text-lg">
                {camp.facltNm}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-4 py-2 flex-1">
              <p className="text-sm text-gray-600 line-clamp-2">{camp.addr1}</p>
            </CardContent>

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
    </main>
  );
}
