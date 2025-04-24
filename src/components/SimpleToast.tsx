"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SimpleToastProps {
  message: string;
  duration?: number;
  onClose(): void;
}

export function SimpleToast({
  message,
  duration = 3000,
  onClose,
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

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="flex fixed bottom-4 w-auto items-center justify-center rounded m-4 p-4 main bg-[#578E7E] left-1/2 transform -translate-x-1/2 text-xl text-[#FFFAEC] pointer-events-none"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
