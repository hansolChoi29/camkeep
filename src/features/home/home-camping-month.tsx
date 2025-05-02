"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function HomeCampingMonth() {
  const plugins = [Autoplay({ delay: 5000, stopOnInteraction: false })];

  return (
    <section className="mt-16">
      <div className="flex justify-center items-center">
        <Carousel
          plugins={plugins}
          className="bg-[#578E7E]  w-full text-white p-2 text-sm sm:text-base "
        >
          <CarouselContent className="flex ">
            <CarouselItem className="flex-shrink-0 w-full text-center">
              이 사이트는 개발자가 되고싶은 사람이 만든 개인 프로젝트입니다.
            </CarouselItem>
            <CarouselItem className="flex-shrink-0 w-full text-center">
              F12를 둘러 반응형을 체험해 보세요.
            </CarouselItem>
            <CarouselItem className="flex-shrink-0 w-full text-center">
              현재 판매 중인 장비와 캠핑장을 열람 할 수 있습니다.
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
