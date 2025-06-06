"use client";

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import { PromoBanner } from "@/types/promotion";
import { promoBanners } from "./promotion-data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export default function HomePromotion() {
  const itemsWithPhoto: PromoBanner[] = promoBanners.filter(
    (b) => typeof b.photo === "string"
  );

  const carouselRef = useRef<HTMLDivElement>(null);
  const plugins = [Autoplay({ delay: 8000, stopOnInteraction: false })];

  return (
    <section className="m-0 overflow-hidden   w-full">
      <Carousel
        opts={{ loop: true }}
        plugins={plugins}
        className="w-full touch-pan-x"
        ref={carouselRef}
      >
        <CarouselContent className="flex space-x-0 snap-x snap-mandatory">
          {itemsWithPhoto.map((banner) => (
            <CarouselItem
              key={banner.id}
              className="relative w-full flex-shrink-0 sm:h-[500px] h-[300px] flex items-center justify-center"
            >
              <div className="relative w-full h-full">
                <Image
                  src={banner.photo!}
                  alt={banner.id}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
