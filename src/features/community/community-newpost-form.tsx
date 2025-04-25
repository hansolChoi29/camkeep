"use client";
import React, { useState } from "react";
import { SimpleToast } from "@/components/SimpleToast";
interface Props {
  onSubmit: (title: string, content: string) => void;
  loading: boolean;
}

export default function CommunityNewPostForm({ onSubmit, loading }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setToast("제목과 내용을 입력하세요.");
      return;
    }
    onSubmit(title.trim(), content.trim());
  };

  return (
    <>
      <form onSubmit={handle} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용"
          className="w-full border px-3 py-2 rounded h-32"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#578E7E] text-white px-4 py-2 rounded"
        >
          {loading ? "작성 중…" : "게시하기"}
        </button>
      </form>
      {toast && (
        <SimpleToast
          message={toast}
          duration={2000}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
