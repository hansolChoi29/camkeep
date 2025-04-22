/** @jsxImportSource @emotion/react */
"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const letterVariants = {
  hidden: { y: -200, rotate: -45, opacity: 0 },
  show: {
    y: 0,
    rotate: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 500, damping: 25 },
  },
};

export default function SplashScreen() {
  const title = "CAMKEEP".split("");

  return (
    // 전체 배경 흰색 페이드인
    <motion.div
      className="fixed inset-0 w-full h-full flex items-center justify-center bg-white z-50"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* 로고용 백그라운드 박스 + 로고 폰트 */}
      <motion.div
        className="logo flex flex-col items-center justify-center bg-[#FFAB5B] w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* 글자 애니메이션 */}
        <div className="flex space-x-1">
          {title.map((char, idx) => (
            <motion.span
              key={idx}
              className="text-[48px] font-bold text-black"
              variants={letterVariants}
            >
              {char}
            </motion.span>
          ))}
        </div>
        {/* 문구는 글자 애니메이션 끝나고 페이드인 */}
        <motion.p
          className="text-base mt-4 text-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: title.length * 0.15 + 0.5, duration: 0.8 }}
        >
          캠핑할때 뭐가 필요하지?
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
