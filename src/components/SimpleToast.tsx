"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

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
  type, // 타입 받기
}: SimpleToastProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout1 = setTimeout(() => setShow(false), duration);
    const timeout2 = setTimeout(onClose, duration + 300);
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bgColor: "bg-gradient-to-r from-[#578E7E] to-[#18c997]",
          textColor: "text-white",
        };
      case "error":
        return {
          bgColor: "bg-gradient-to-r from-[#ff9800] to-[#f57c00]",
          textColor: "text-white",
        };
      case "warning":
        return {
          bgColor: "bg-gradient-to-r from-[#000000] to-[#777777]",
          textColor: "text-white",
        };
      default:
        return {
          bgColor: "bg-gradient-to-r from-[#578E7E] to-[#abd1c6]",
          textColor: "text-white",
        };
    }
  };

  const { bgColor, textColor } = getStyles();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5 }}
          className={`flex fixed bottom-[80px] right-[30px] w-80 p-6 items-center justify-center rounded-lg ${bgColor} ${textColor} shadow-2xl transform -translate-x-1/2 sm:text-lg`}
        >
          <div className="flex flex-col items-center justify-center w-full">
            <p className="font-semibold text-center sm:text-xl">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
