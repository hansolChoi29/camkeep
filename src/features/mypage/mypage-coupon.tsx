"use client";

import { CouponMock } from "./coupon-mock";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function MypageCoupon() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });
  const [prevEnabled, setPrevEnabled] = useState(false);
  const [nextEnabled, setNextEnabled] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setPrevEnabled(emblaApi.canScrollPrev());
      setNextEnabled(emblaApi.canScrollNext());
    };
    emblaApi.on("select", onSelect);
    // 초기 상태 설정
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <section className="w-full my-8 logo">
      <h1 className="text-2xl font-bold mb-2 sm:mb-4">내가 보유한 쿠폰</h1>
      <div className="relative">
        {/* 이전 버튼: 더 이상 넘길 항목 없을 때만 비활성화 */}
        <motion.button
          onClick={scrollPrev}
          disabled={!prevEnabled}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow focus:outline-none transition-opacity ${
            prevEnabled ? "opacity-100" : "opacity-50 cursor-not-allowed"
          }`}
          aria-label="이전"
        >
          <ArrowLeft size={24} />
        </motion.button>

        {/* 캐러셀 슬라이더 */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex space-x-6 px-8">
            {CouponMock.map((c, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 min-w-[150px] sm:min-w-[350px] border-4 border-[#578E7E] rounded-lg bg-white relative pl-4 pr-2 py-2"
              >
                <div className="flex h-full">
                  {/* 왼쪽: Voucher 정보 */}
                  <div className="flex-1 flex flex-col justify-center pr-4">
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

                  {/* 구분선 */}
                  <div className="border-l-2 border-dashed border-gray-300 mx-2"></div>

                  {/* 오른쪽: 바코드와 유효기간 */}
                  <div className="w-32 flex flex-col items-center">
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
                    {/* 유효기간 */}
                    <p className="text-xs text-gray-500 uppercase mt-2 text-center">
                      사용기한
                      <br />
                      {c.date}
                    </p>
                    {/* 반원 절취선 */}
                    <div className="absolute right-0 bottom-0 w-6 h-6 bg-white rounded-tl-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 다음 버튼: 더 이상 넘길 항목 없을 때만 비활성화 */}
        <motion.button
          onClick={scrollNext}
          disabled={!nextEnabled}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow focus:outline-none transition-opacity ${
            nextEnabled ? "opacity-100" : "opacity-50 cursor-not-allowed"
          }`}
          aria-label="다음"
        >
          <ArrowRight size={24} />
        </motion.button>
      </div>
    </section>
  );
}
