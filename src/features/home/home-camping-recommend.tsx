"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CampingItem } from "@/lib/camping";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomeCampingRecommend() {
  const [items, setItems] = useState<CampingItem[]>([]);

  useEffect(() => {
    fetch("/api/go-camping?pageNo=1")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch(console.error);
  }, []);

  const plugins = [Autoplay({ delay: 5000, stopOnInteraction: false })];

  return (
    <section className="mt-10 w-full">
      <h2 className="text-2xl font-semibold mb-4">회원님을 위한 캠핑장 추천</h2>
      <Carousel plugins={plugins} opts={{ loop: true }} className="touch-pan-x">
        <CarouselContent className="flex space-x-4">
          {items.map((item) => (
            <CarouselItem
              key={item.contentId}
              className="flex-shrink-0 w-[280px]"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="truncate">{item.facltNm}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={item.firstImageUrl ?? "/images/default-camp.png"}
                    alt={item.facltNm}
                    width={280}
                    height={160}
                    className="rounded-md object-cover"
                  />
                  <p className="mt-2 text-sm text-gray-600 truncate">
                    {item.addr1}
                  </p>
                  <Link
                    href={`/camping/${item.contentId}`}
                    className="mt-2 inline-block text-blue-600 hover:underline"
                  >
                    자세히 보기
                  </Link>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
