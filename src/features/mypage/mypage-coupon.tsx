"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CouponMuck } from "./coupon-mock";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

export default function MypageCoupon() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <section className="w-full my-8">
      <h1 className="text-xl font-semibold mb-4">내가 보유한 쿠폰</h1>
      <div className="relative">
        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10"
          aria-label="이전"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex space-x-4">
            {CouponMuck.map((coupon, idx) => (
              <div key={idx} className="flex-shrink-0 min-w-[250px]">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>{coupon.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{coupon.des}</p>
                    <p className="text-sm text-gray-500 mt-1">{coupon.date}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10"
          aria-label="다음"
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </section>
  );
}
