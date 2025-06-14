"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface SimpleToastProps {
  message: string;
  duration?: number;
  onClose(): void;
  type: "success" | "error" | "warning";
}

export function SimpleToast({
  message,
  duration = 3000,
  onClose,
  type,
}: SimpleToastProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t1 = setTimeout(() => setShow(false), duration);
    const t2 = setTimeout(onClose, duration + 300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [duration, onClose]);

  // 타입별 아이콘 SVG와 배경색 매핑
  const ICONS: Record<SimpleToastProps["type"], { src: string; bg: string }> = {
    success: {
      bg: "bg-[#4CAF50]",
      src: "/icons/alert-success.svg",
    },
    error: {
      bg: "bg-[#AF4C4C]",
      src: "/icons/alert-error.svg",
    },
    warning: {
      bg: "bg-[#FFC107]",
      src: "/icons/alert-warning.svg",
    },
  };

  const { src, bg } = ICONS[type];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5 }}
          className="flex fixed bottom-[80px] left-16 transform -translate-x-1/2 bg-gray-600 rounded-[28px] shadow-2xl px-4 py-2"
        >
          {/* 아이콘 */}
          <div
            className={`flex-shrink-0 w-10 h-10 ${bg} rounded-full flex items-center justify-center `}
          >
            <Image
              src={src}
              alt={type}
              className="w-12 h-12"
              width={12}
              height={12}
            />
          </div>
          {/* 메시지 */}
          <div className="flex-1 flex items-center ml-2 text-white text-base sm:text-lg">
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
