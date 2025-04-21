"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function HomeCampingMonth() {
  return (
    <>
      <section>
        <h1>이달의 캠핑장</h1>
        <Carousel className="bg-[#DCE4C9] h-[133px]">
          <CarouselContent>
            <CarouselItem>.1..</CarouselItem>
            <CarouselItem>.2..</CarouselItem>
            <CarouselItem>.3..</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </>
  );
}
