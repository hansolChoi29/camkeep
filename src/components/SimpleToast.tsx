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
          className="flex fixed bottom-[100px] w-auto items-center justify-center rounded-2xl m-4 p-4 main bg-white right-[40px] transform -translate-x-1/2 text-[#57608E] pointer-events-none text-2xl"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
