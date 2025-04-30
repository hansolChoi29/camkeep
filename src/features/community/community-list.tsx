"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: { nickname: string; profile: string | null };
}

export default function CommentsList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 1) 댓글 불러오기
  const fetchComments = () =>
    fetch(`/api/community/${postId}/comments`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || "조회 실패");
        return res.json() as Promise<Comment[]>;
      })
      .then(setComments)
      .catch((err) => setError(err.message));

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // 2) 댓글 작성
  const submit = async () => {
    if (!newComment.trim()) {
      setError("댓글 내용을 입력해주세요.");
      return;
    }
    const res = await fetch(`/api/community/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newComment.trim() }),
    });
    if (!res.ok) {
      setError((await res.json()).error || "댓글 작성 실패");
    } else {
      setNewComment("");
      fetchComments();
    }
  };

  return (
    <div className="space-y-2 w-full">
      {error && <div className="text-red-500">{error}</div>}
      <div className="space-y-1">
        {comments.map((c) => (
          <div key={c.id} className="flex items-start space-x-2">
            {c.user.profile && (
              <Image
                src={c.user.profile}
                alt={c.user.nickname}
                className="w-6 h-6 rounded-full object-cover border"
                width={600}
                height={600}
              />
            )}
            <div>
              <p className="text-sm font-medium">{c.user.nickname}</p>
              <p className="text-sm">{c.content}</p>
              <time className="text-xs text-gray-400">
                {new Date(c.created_at).toLocaleString()}
              </time>
            </div>
          </div>
        ))}
      </div>
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
