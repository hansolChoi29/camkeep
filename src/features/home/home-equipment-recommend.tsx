"use client";

import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  CATEGORIES,
  type Category,
} from "@/features/equipment-list/equipment-data";
import type { NaverItem } from "@/app/equipment-list/components/equipmentList.client";

export default function HomeEquipmentRecommend() {
  //  카테고리별 데이터를 저장할 state
  const [data, setData] = useState<Record<Category, NaverItem[]>>(
    {} as Record<Category, NaverItem[]>
  );
  const [errors, setErrors] = useState<Record<Category, string>>(
    {} as Record<Category, string>
  );
  const [loading, setLoading] = useState(true);

  // mount 시 모든 카테고리에 대해 API 호출
  useEffect(() => {
    (async () => {
      const result = {} as Record<Category, NaverItem[]>;
      const errResult = {} as Record<Category, string>;

      await Promise.all(
        CATEGORIES.map(async ({ label: cat }) => {
          try {
            const res = await fetch(
              `/api/shop?query=${encodeURIComponent("캠핑 " + cat)}&display=10`
            );
            if (!res.ok) throw new Error(res.statusText);
            const json = await res.json();
            result[cat] = json.items || [];
          } catch (e: unknown) {
            result[cat] = [];
            errResult[cat] = e instanceof Error ? e.message : String(e);
          }
        })
      );

      setData(result);
      setErrors(errResult);
      setLoading(false);
    })();
  }, []);

  const plugins = [Autoplay({ delay: 6000, stopOnInteraction: false })];

  if (loading) {
    return <p className="p-6 text-center">로딩중…</p>;
  }

  return (
    <section className="space-y-16 mb-44">
      {CATEGORIES.map(({ label: cat }) => (
        <article key={cat} className="mt-10 sm:mb-10 mb-20 gowun ">
          <h2 className="text-base sm:text-xl font-semibold mb-4">
            회원님을 위한 {cat} 추천
          </h2>

          {errors[cat] ? (
            <p className="text-red-600">조회 실패: {errors[cat]}</p>
          ) : data[cat]?.length ? (
            <article className="border p-5 rounded">
              <Carousel
                plugins={plugins}
                opts={{
                  loop: true,
                  align: "start",
                  dragFree: true,
                  skipSnaps: true,
                }}
                className="touch-pan-x w-full"
              >
                <CarouselContent className="flex space-x-4 w-[240px]">
                  {data[cat].map((item, i) => (
                    <CarouselItem
                      key={`${cat}-${i}`}
                      className="flex-shrink-0 mx-0 w-[240px]"
                    >
                      <Card className="overflow-hidden p-0">
                        <CardContent className="p-0 h-full flex flex-col">
                          <div className="relative h-[200px] flex-shrink-0">
                            <Image
                              src={item.image ?? "/images/noimages.svg"}
                              alt={item.title.replace(/<[^>]*>/g, "")}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4 flex-1 flex flex-col">
                            <CardTitle className="truncate text-sm">
                              {item.title.replace(/<[^>]*>/g, "")}
                            </CardTitle>
                            <p className="mt-2 w-full flex justify-end text-xs text-gray-600">
                              {item.lprice.toLocaleString()}원
                            </p>
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 w-full flex justify-end text-xs text-[#578E7E] hover:underline"
                            >
                              쇼핑하러 가기
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </article>
          ) : (
            <p className="px-2 text-gray-500">새로고침 해주세요.</p>
          )}
        </article>
      ))}
    </section>
  );
}
