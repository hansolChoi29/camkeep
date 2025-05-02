"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function HomeCampingMonth() {
  return (
    <>
      <section className="mt-4">
        <Carousel className="bg-[#578E7E] text-white p-2 ">
          <CarouselContent>
            <CarouselItem>
              .1..이달의 캠핑장이달의 캠핑장이달의 캠핑장이달의 캠핑장
            </CarouselItem>
            <CarouselItem>
              .2..이달의 캠핑장이달의 캠핑장이달의 캠핑장이달의 캠핑장
            </CarouselItem>
            <CarouselItem>
              .3..이달의 캠핑장이달의 캠핑장이달의 캠핑장이달의 캠핑장이달의
              캠핑장이달의 캠핑장이달의 캠핑장이달의 캠핑장
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          {/* <CarouselNext /> */}
        </Carousel>
      </section>
    </>
  );
}
