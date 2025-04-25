"use client";
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
interface CommunityModalProps {
  onClose: () => void;
  open: boolean;
  children: React.ReactNode;
}
export default function CommunityNewpostModal({
  onClose,
  open,
  children,
}: CommunityModalProps) {
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  if (!open) return null;

  const btnVariants = {
    rest: { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" },
    hover: { scale: 1.05, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" },
    tap: { scale: 0.95 },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className=" p-4 bg-white overflow-y-auto sm:rounded-lg sm:max-w-lg sm:max-h-[80vh] w-full h-full       sm:rounded-lg[scrollbar-width:none]  sm:w-auto sm:h-auto   [&::-webkit-scrollbar]:hidden"
          >
            <motion.button
              variants={btnVariants}
              onClick={onClose}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              animate="rest"
              className="absolute top-2 right-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </motion.button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
