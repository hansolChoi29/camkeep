"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";

export default function LikeButton({ postId }: { postId: string }) {
  const user = useUser();
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const fetchLikes = () =>
    fetch(`/api/community/${postId}/likes`)
      .then((r) => r.json())
      .then((data) => {
        setCount(data.count);
        setLiked(data.liked);
      });

  useEffect(() => {
    fetchLikes();
  }, [postId]);

  const toggle = async () => {
    if (!user) return alert("로그인 필요");
    await fetch(`/api/community/${postId}/likes`, { method: "POST" });
    fetchLikes();
  };

  return (
    <button
      onClick={toggle}
      className={`flex items-center space-x-1 ${
        liked ? "text-red-500" : "text-gray-500"
      }`}
    >
      <svg
        className="w-5 h-5"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeWidth="2"
          d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 
             116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z"
        />
      </svg>
      <span className="text-sm">{count}</span>
    </button>
  );
}
