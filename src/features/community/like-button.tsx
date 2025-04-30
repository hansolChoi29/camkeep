"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export default function LikeButton({ postId }: { postId: string }) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);

  // 초기 좋아요 개수 가져오기
  useEffect(() => {
    fetch(`/api/community/${postId}/likes`)
      .then((res) => res.json())
      .then(({ count }) => setCount(count))
      .catch(console.error);
  }, [postId]);

  // 좋아요 토글
  const toggleLike = async () => {
    const res = await fetch(`/api/community/${postId}/likes`, {
      method: "POST",
    });
    if (res.ok) {
      setLiked((prev) => !prev);
      setCount((prev) => prev + (liked ? -1 : +1));
    } else {
      console.error("좋아요 실패:", await res.json());
    }
  };

  return (
    <button
      onClick={toggleLike}
      className="flex items-center space-x-1 text-sm"
    >
      {/* 하트 색 변경 */}
      {liked ? (
        <Heart fill="currentColor" stroke="none" className="text-red-500" />
      ) : (
        <Heart />
      )}
      {/* 숫자 표시 */}
      <span>{count}</span>
    </button>
  );
}
