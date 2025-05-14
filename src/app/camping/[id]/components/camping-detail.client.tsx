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
          <p className="mt-2 ">예약 방식: {camp.resveCl ?? "정보 없음"}</p>
          <p className="mt-2 ">부대 시설: {camp.sbrsCl ?? "정보 없음"}</p>
          <p className="mt-2 ">취사장 형태: {camp.brazierCl ?? "정보 없음"}</p>
          <p className="mt-2 ">운영 요일: {camp.operDeCl ?? "정보 없음"}</p>
          <div className="border rounded">
            <p className="mt-2 ">
              일반 야영장 수: {camp.gnrlSiteCo ?? "정보 없음"}
            </p>
            <p className="mt-2 ">
              자동차 야영장 수: {camp.autoSiteCo ?? "정보 없음"}
            </p>
            <p className="mt-2 ">
              카라반 사이트 수: {camp.caravSiteCo ?? "정보 없음"}
            </p>
            <p className="mt-2 ">
              글램핑 사이트 수: {camp.glampSiteCo ?? "정보 없음"}
            </p>
            <p className="mt-2 ">반려동물: {camp.animalCmgCl ?? "정보 없음"}</p>
          </div>
          <Link
            href={camp.homepage!}
            className="hover:underline text-[#578E7E]"
          >
            홈페이지로 이동
          </Link>
          <Link
            href={camp.resveUrl!}
            className="hover:underline text-[#578E7E]"
          >
            예약사이트로 이동
          </Link>
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
