"use client";

import { SimpleToast } from "@/app/components/SimpleToast";
import { timeAgo } from "@/lib/utils";
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: { nickname: string; profile: string | null };
}

interface CommentsListProps {
  postId: string;
  onCommentAdded?: () => void;
}

export default function CommentsList({
  postId,
  onCommentAdded,
}: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "warning">(
    "success"
  );

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

  const submit = async () => {
    if (!newComment.trim()) {
      setError("댓글 내용을 입력해 주세요.");
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
      setToast("성공적으로 등록되었습니다.");
      setToastType("success");
      onCommentAdded?.();
    }
  };

  return (
    <div className="space-y-2 w-full">
      {error && <div className="text-red-500">{error}</div>}

      <div className="space-y-1">
        {comments.map((c) => (
          <div
            key={c.id}
            className="flex flex-col sm:flex-row items-start sm:items-center border-t p-2"
          >
            {/* 프로필 · 닉네임 · 내용 */}
            <div className="flex items-start sm:items-center space-x-2 w-full sm:w-auto">
              {c.user.profile && (
                <Image
                  src={c.user.profile ?? "/icons/myprofile.svg"}
                  alt={c.user.nickname}
                  width={32}
                  height={32}
                  className="rounded-full object-cover border"
                />
              )}
              {/* break-words : 강제 개행 */}
              <div className="flex flex-col break-words w-full">
                <p className="text-xs  text-[#578E7E] font-bold">
                  {c.user.nickname}
                </p>
                <p className="text-xs break-words">{c.content}</p>
              </div>
            </div>

            <time className="text-xs text-gray-500 mt-1 sm:mt-0 sm:ml-auto">
              {timeAgo(c.created_at)}
            </time>
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

      {toast && (
        <SimpleToast
          message={toast}
          duration={2000}
          onClose={() => setToast(null)}
          type={toastType}
        />
      )}
    </div>
  );
}
