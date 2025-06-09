"use client";

import Image from "next/image";
import Link from "next/link";
import { CampingItem } from "@/lib/camping";

interface CampingDetailClientProps {
  camp: CampingItem;
}
export default function CampingDetailClient({
  camp,
}: CampingDetailClientProps) {
  return (
    <main className="max-w-4xl mx-auto my-8 space-y-6">
      <div className="overflow-hidden flex flex-col">
        <div className="sm:flex">
          {camp.firstImageUrl && (
            <div className="relative w-full h-64">
              <Image
                src={camp.firstImageUrl}
                alt={camp.facltNm}
                fill
                className="object-cover "
              />
            </div>
          )}
        </div>

        <div className="border p-1 text-base rounded-b-2xl px-4 py-2 shadow">
          <div className="ml-2 ">
            <div className="flex items-center ">
              <p className="sm:text-2xl text-base font-bold text-[#578E7E]">
                {camp.facltNm}
              </p>
              <div className="badges sm:text-sm text-xs text-[#E07B39]">
                {camp.hasGlamping ? (
                  <span className="badge-glamp">글램핑 가능</span>
                ) : (
                  <span className="badge-camp ">일반 캠핑장</span>
                )}
              </div>
            </div>
            <div className="sm:text-base text-sm">
              <p className="mt-4 ">주소: {camp.addr1}</p>
              <p className="mt-2 ">전화: {camp.tel ?? "정보 없음"}</p>
              <p className="mt-2 ">
                예약 방식: {camp.resveCl ?? "정보 없음"}
              </p>{" "}
              <p className="mt-2 ">
                반려동물 : {camp.animalCmgCl ?? "정보 없음"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <div className="border rounded-b-2xl px-4 py-2 shadow mt-10">
            <h1>캠핑장 소개</h1>
            <div className="flex justify-center">
              <p className="mt-4">
                {camp.lineIntro ??
                  camp.intro ??
                  "아름다운 자연 속에서 편안한 휴식을 즐길 수 있는 캠핑장입니다. 평온한 숲과 맑은 공기, 그리고 별빛 가득한 밤하늘을 느껴보세요."}
              </p>
            </div>
          </div>

          <div className="border rounded-b-2xl px-4 py-2 shadow ">
            <h1>이용시설</h1>
            {camp.sbrsCl ? (
              <ul className="mt-2 flex list-disc list-inside space-x-4 place-content-evenly">
                {camp.sbrsCl.split(",").map((facility, idx) => (
                  <li key={idx}>{facility.trim()}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2">정보 없음</p>
            )}

            {/* <p className="mt-2 ">
            일반 야영장 수 : {camp.gnrlSiteCo ?? "정보 없음"}
            </p>
            <p className="mt-2 ">
            자동차 야영장 수 : {camp.autoSiteCo ?? "정보 없음"}
            </p>
            <p className="mt-2 ">
            카라반 사이트 수 : {camp.caravSiteCo ?? "정보 없음"}
            </p>
            <p className="mt-2 ">
            글램핑 사이트 수 : {camp.glampSiteCo ?? "정보 없음"}
            </p> */}
          </div>

          <div className=" rounded-b-2xl px-4 py-2 shadow ">
            <h1>취사장 형태</h1>
            <div className="flex justify-center">
              <p className="mt-2 ">
                {camp.brazierCl === "개별"
                  ? "개별 화로대 제공"
                  : camp.brazierCl === "공용"
                  ? "공용 화로대 제공"
                  : "취사 시설 미제공 (개인 취사 도구 지참)"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center gap-2 mt-20 mb-10">
          <Link
            href={camp.homepage!}
            className=" bg-[#85D962] rounded-lg px-2 py-2 text-white hover:bg-[#54ac2e]"
          >
            홈페이지로 이동
          </Link>
          <Link
            href={camp.resveUrl!}
            className=" bg-[#85D962] rounded-lg px-2 py-2 text-white hover:bg-[#54ac2e]"
          >
            예약사이트로 이동
          </Link>
          <Link
            href="/camping"
            className=" bg-[#578E7E] rounded-lg px-2 py-2 text-white hover:bg-[#178e6c]"
          >
            캠핑장 목록으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
