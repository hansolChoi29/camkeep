"use client";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { SimpleToast } from "@/components/SimpleToast";
import { browserSupabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
interface Props {
  onSubmit: (title: string, content: string, photos: string[]) => void;
  loading: boolean;
}

export default function CommunityNewPostForm({ onSubmit, loading }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);
  const supabase = browserSupabase();

  const uploadPhotos = async (): Promise<string[]> => {
    if (!files || files.length === 0) return [];

    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const ext = file.name.split(".").pop();

      const fileName = `posts/${uuidv4()}.${ext}`;

      const { data, error } = await supabase.storage
        .from("post-photos")
        .upload(fileName, file);
      if (error) {
        console.error("Storage upload failed:", error);
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("post-photos").getPublicUrl(data.path);

      urls.push(publicUrl);
    }
    return urls;
  };

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setToast("로그인이 필요합니다.");

      return;
    }

    if (!title.trim() || !content.trim()) {
      setToast("제목과 내용을 입력해 주세요.");

      return;
    }

    try {
      const photoUrls = await uploadPhotos();

      if (photoUrls.length > 0) {
        const { error: updateError } = await supabase

          .from("community_posts")
          .update({ photos: photoUrls[0] })
          .eq("id", user.id);

        if (updateError) {
          console.error("게시글 사진 업로드 실패:", updateError);

          setToast("게시글 사진 업로드 실패");

          return;
        }
      }

      onSubmit(title.trim(), content.trim(), photoUrls);
    } catch (e) {
      console.error(e);

      setToast("사진 업로드에 실패했습니다.");
    }
  };

  return (
    <>
      <form onSubmit={handle} className="space-y-4">
        <input
          type="text"
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
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(e.target.files)}
          className="w-full"
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
