"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { PromoBanner } from "@/types/promotion";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { promoBanners } from "../promotion-data";

export default function HomePromotion() {
  const items: PromoBanner[] = promoBanners;
  const carouselRef = useRef<HTMLDivElement>(null);

  const plugins = [Autoplay({ delay: 2000, stopOnInteraction: false })];

  return (
    <>
      <section className="overflow-hidden">
        <Carousel
          opts={{ loop: true }}
          plugins={plugins}
          className="w-full touch-pan-x"
          ref={carouselRef}
        >
          <CarouselContent className="flex space-x-0 snap-x snap-mandatory">
            {items.map((banner) => (
              <CarouselItem
                key={banner.id}
                className="
                w-full flex-shrink-0
                flex items-center justify-center
                bg-[#FFAB5B] p-4 text-white text-center
              "
              >
                {banner.text}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    </>
  );
}
