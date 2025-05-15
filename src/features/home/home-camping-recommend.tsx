"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CampingItem } from "@/lib/camping";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

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
    <section className="mt-10 sm:mb-10 mb-20 font-roboto">
      <h2 className="sm:text-xl text-base font-semibold mb-4">
        회원님을 위한 캠핑장 추천
      </h2>
      <article className="border p-5 rounded">
        <Carousel
          plugins={plugins}
          opts={{ loop: true, align: "start", dragFree: true, skipSnaps: true }}
          className="touch-pan-x w-full"
        >
          <CarouselContent className="flex space-x-4 w-[240px]">
            {items.map((item) => (
              <CarouselItem
                key={item.contentId}
                className="flex-shrink-0  mx-0"
              >
                <Card className="overflow-hidden p-0 ">
                  <CardContent className="p-0 flex flex-col">
                    <div className="relative h-[200px] flex-shrink-0">
                      <Image
                        src={item.firstImageUrl ?? "/images/default-camp.png"}
                        alt={item.facltNm}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <CardTitle className="truncate text-sm">
                        {item.facltNm}
                      </CardTitle>
                      <p className="mt-2 text-sm text-gray-600 truncate">
                        {item.addr1}
                      </p>
                      <Link
                        href={`/camping/${item.contentId}`}
                        className="mt-2 text-sm w-full flex justify-end  text-[#578E7E] hover:underline"
                      >
                        자세히 보기
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </article>
    </section>
  );
}
