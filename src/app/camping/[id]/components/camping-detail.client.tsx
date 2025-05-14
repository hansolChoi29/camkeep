"use client";

import Image from "next/image";
import Link from "next/link";
import { CampingItem } from "@/lib/camping";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

interface CampingDetailClientProps {
  camp: CampingItem;
}

export default function CampingDetailClient({
  camp,
}: CampingDetailClientProps) {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="overflow-hidden">
        {camp.firstImageUrl && (
          <div className="relative w-full h-64">
            <Image
              src={camp.firstImageUrl}
              alt={camp.facltNm}
              fill
              className="object-cover"
            />
          </div>
        )}
        <CardContent className="p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{camp.facltNm}</CardTitle>
          </CardHeader>
          <p className="mt-4 ">주소: {camp.addr1}</p>
          <p className="mt-2 ">전화: {camp.tel ?? "정보 없음"}</p>
          <p className="mt-2 ">운영시간: {camp.operPdCl ?? "정보 없음"}</p>
        </CardContent>
        <CardFooter className="p-6 flex justify-end">
          <Link
            href="/camping"
            className="text-sm text-[#578E7E] hover:underline"
          >
            ← 캠핑장 목록으로 돌아가기
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
