"use client";
import { useEffect, useState } from "react";
import { NaverItem } from "@/app/equipment-list/components/equipmentList.client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export default function HomeEquipmentRecommend() {
  const [items, setItems] = useState<NaverItem[]>([]);

  useEffect(() => {
    fetch("/api/shop?query=캠핑용품&display=10")
      .then((res) => res.json())
      .then((data) => setItems(data.items ?? []))
      .catch(console.error);
  }, []);

  const plugins = [Autoplay({ delay: 6000, stopOnInteraction: false })];

  return (
    <section className="mt-10 sm:mb-10 mb-20 font-roboto">
      <h2 className="text-2xl font-semibold mb-4">
        회원님을 위한 캠핑장비 추천
      </h2>
      <Carousel
        plugins={plugins}
        opts={{ loop: true, align: "start", dragFree: true, skipSnaps: true }}
        className="touch-pan-x"
      >
        {/* gap-0 설정으로 카드 사이 여백 제거 */}
        <CarouselContent className="flex space-x-0 w-[240px] h-[360px]">
          {items.map((item, i) => (
            <CarouselItem key={i} className="flex-shrink-0  mx-0">
              <Card className="overflow-hidden p-0 ">
                <CardContent className="p-0 h-full flex flex-col">
                  <div className="relative h-[200px] flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title.replace(/<[^>]*>/g, "")}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <CardTitle className="truncate text-base">
                      {item.title.replace(/<[^>]*>/g, "")}
                    </CardTitle>
                    <p className="mt-2 w-full flex justify-end text-sm text-gray-600">
                      {item.lprice}원
                    </p>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 w-full flex justify-end text-sm text-[#578E7E] hover:underline"
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
    </section>
  );
}
