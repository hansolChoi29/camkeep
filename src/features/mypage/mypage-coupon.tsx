"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CouponMuck } from "./coupon-mock";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
export default function MypageCoupon() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  // 슬라이더 선택 시 버튼 활성화 상태 업데이트
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setPrevBtnEnabled(emblaApi.canScrollPrev());
      setNextBtnEnabled(emblaApi.canScrollNext());
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <section className="w-full my-8">
      <h1 className="text-xl font-semibold mb-4">내가 보유한 쿠폰</h1>
      <div className="relative">
        {/* 이전 버튼 */}
        <motion.button
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10 transition-opacity ${
            !prevBtnEnabled ? "opacity-50 cursor-not-allowed" : "opacity-100"
          }`}
          aria-label="이전"
        >
          <ArrowLeft size={24} />
        </motion.button>

        {/* 캐러셀 컨테이너 */}
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

        {/* 다음 버튼 */}
        <motion.button
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10 transition-opacity ${
            !nextBtnEnabled ? "opacity-50 cursor-not-allowed" : "opacity-100"
          }`}
          aria-label="다음"
        >
          <ArrowRight size={24} />
        </motion.button>
      </div>
    </section>
  );
}
