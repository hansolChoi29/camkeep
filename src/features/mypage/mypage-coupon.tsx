"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CouponMock } from "./coupon-mock";

export default function MypageCoupon() {
  return (
    <article className="w-full my-8 logo">
      <h1 className="text-2xl font-bold mb-4">내가 보유한 쿠폰</h1>
      <Carousel className="relative">
        <CarouselContent className="-ml-8 md:-ml-4">
          {CouponMock.map((c, idx) => (
            <CarouselItem
              key={idx}
              className="pl-8 md:pl-4 basis-[350px] sm:basis-[450px]"
            >
              <div className="flex-shrink-0 border-4 border-[#578E7E] rounded-lg bg-white px-4 pr-1 py-1 flex h-full">
                <div className="flex flex-1 pr-4 pl-1">
                  <div className="flex flex-col justify-center">
                    <span className="text-sm font-medium uppercase text-gray-600">
                      Gift Voucher
                    </span>
                    <h2 className="text-base sm:text-4xl font-bold text-[#578E7E] mt-1">
                      {c.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-700 mt-2">
                      {c.des}
                    </p>
                  </div>
                </div>
                <div className="border-l-2 border-dashed border-gray-300 mx-1" />
                <div className="w-32 flex flex-col items-center relative">
                  <svg width="50" height="80" className="mt-2">
                    {[...Array(20)].map((_, i) => (
                      <rect
                        key={i}
                        x={i * 2 + (i % 2) * 1}
                        y={0}
                        width={i % 3 === 0 ? 2 : 1}
                        height={80}
                        fill="#333"
                      />
                    ))}
                  </svg>
                  <p className="text-xs text-gray-500 uppercase mt-2 text-center">
                    사용기한
                    <br />
                    {c.date}
                  </p>
                  <div className="absolute right-0 bottom-0 w-6 h-6 bg-white rounded-tl-full" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* 커스텀 네비게이션 버튼 */}
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10 disabled:opacity-50 disabled:cursor-not-allowed">
          <ArrowLeft size={24} />
        </CarouselPrevious>
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10 disabled:opacity-50 disabled:cursor-not-allowed">
          <ArrowRight size={24} />
        </CarouselNext>
      </Carousel>
    </article>
  );
}
