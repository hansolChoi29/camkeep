"use client";
import { SimpleToast } from "@/components/SimpleToast";
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
      onCommentAdded?.();
    }
  };

  return (
    <div className="space-y-2 w-full">
      {error && <div className="text-red-500">{error}</div>}
      <div className="space-y-1">
        {comments.map((c) => (
          <div key={c.id} className="flex items-center border-t p-2 ">
            <div className="flex items-center justify-center flex-shrink-0 ">
              {c.user.profile && (
                <Image
                  src={c.user.profile}
                  alt={c.user.nickname}
                  width={32}
                  height={32}
                  className="rounded-full object-cover border"
                />
              )}

              <p className="text-sm font-medium ml-1">{c.user.nickname} : </p>
            </div>
            <div className="w-full flex items-center ">
              <p className="text-sm">{c.content}</p>
            </div>
            <div className="w-full flex justify-end">
              <time className="text-xs  flex ">{timeAgo(c.created_at)}</time>
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
      {toast && (
        <SimpleToast
          message={toast}
          duration={2000}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
