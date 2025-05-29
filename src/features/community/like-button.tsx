"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

interface LikeResponse {
  count: number;
  liked: boolean;
}

export default function LikeButton({ postId }: { postId: string }) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);

  // 마운트 시, 서버에서 count+liked 함께 가져오기
  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch(`/api/community/${postId}/likes`);
        const json = (await res.json()) as LikeResponse;
        setCount(json.count);
        setLiked(json.liked);
      } catch (e) {
        console.error("좋아요 상태 조회 실패:", e);
      }
    }
    fetchStatus();
  }, [postId]);

  // 토글하면 POST 호출 → 서버가 insert/delete → 새로운 count 반환
  const toggleLike = async () => {
    try {
      const res = await fetch(`/api/community/${postId}/likes`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("요청 실패");
      const { count: newCount } = (await res.json()) as { count: number };
      setCount(newCount);
      setLiked((prev) => !prev);
    } catch (e) {
      console.error("좋아요 토글 실패:", e);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      animate={
        liked ? { scale: [1, 1.3, 1], transition: { duration: 0.3 } } : {}
      }
      onClick={toggleLike}
      className="flex items-center space-x-1 text-sm hover:opacity-80"
    >
      {liked ? (
        <Heart fill="currentColor" className="text-red-500" />
      ) : (
        <Heart />
      )}
      <span>{count}</span>
    </motion.button>
  );
}
