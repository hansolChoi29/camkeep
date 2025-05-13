"use client";
import { useEffect, useState } from "react";
import { NaverItem } from "@/app/equipment-list/components/equipmentList.client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <section className="mt-10 px-4 mb-10">
      <h2 className="text-2xl font-semibold mb-4">
        회원님을 위한 캠핑장비 추천
      </h2>
      <Carousel
        plugins={plugins}
        opts={{ loop: true, align: "start", dragFree: true, skipSnaps: true }}
        className="touch-pan-x"
      >
        <CarouselContent className="flex space-x-4 w-[240px]">
          {items.map((item, i) => (
            <CarouselItem key={i} className="flex-shrink-0 ">
              <Card className="h-[360px]">
                <CardHeader>
                  <CardTitle
                    className="truncate"
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  />
                </CardHeader>
                <CardContent>
                  <Image
                    src={item.image}
                    alt={item.title.replace(/<[^>]*>/g, "")}
                    width={200}
                    height={200}
                    className="rounded-md object-cover"
                  />
                  <p className="mt-2 text-sm text-gray-600">{item.lprice}원</p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-blue-600 hover:underline"
                  >
                    쇼핑하러 가기
                  </a>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
