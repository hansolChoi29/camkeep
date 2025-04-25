"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@supabase/auth-helpers-react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: { nickname: string; photo: string | null };
}

export default function CommentsList({
  postId,
  currentUser,
}: {
  postId: string;
  currentUser: ReturnType<typeof useUser>;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = () =>
    fetch(`/api/community/${postId}/comments`)
      .then((r) => r.json())
      .then(setComments);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const submit = async () => {
    if (!currentUser) return alert("로그인 필요");
    await fetch(`/api/community/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newComment }),
    });
    setNewComment("");
    fetchComments();
  };

  return (
    <div className="space-y-2 flex items-center">
      <span className="text-sm text-gray-500 mr-2">
        댓글 {comments.length}개
      </span>
      <div className="flex space-x-2">
        <input
          className="flex-1 border px-2 py-1 rounded"
          placeholder="댓글 달기..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={submit}
          className="bg-[#578E7E] text-white px-3 py-1 rounded"
        >
          등록
        </button>
      </div>
    </div>
  );
}
