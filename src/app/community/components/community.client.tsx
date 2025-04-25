"use client";
import React, { useEffect, useState } from "react";
import { SimpleToast } from "@/components/SimpleToast";
import { useUser } from "@supabase/auth-helpers-react";
interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
}

export default function CommunityClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const user = useUser();
  // 초기 게시글 불러오기
  useEffect(() => {
    fetch("/api/community")
      .then(async (res) => {
        if (!res.ok) throw new Error(`GET /api/community ${res.status}`);
        return res.json();
      })
      .then(setPosts)
      .catch((err) => {
        console.error(err);
        setToastMsg("게시글을 불러오지 못했습니다.");
      });
  }, []);

  
  // 새글 작성
  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setToastMsg("로그인이 필요합니다.");
      return;
    }
    setLoading(true);

    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        user_id: user.id,
      }),
    });
    setLoading(false);
    const raw = await res.text();
    if (!res.ok) {
      let errMsg: string;
      try {
        const errJson = JSON.parse(raw);
        errMsg = errJson.error || raw;
      } catch {
        errMsg = await res.text();
      }
      console.error("POST /api/community failed:", errMsg);
      setToastMsg("게시글 등록에 실패했습니다.");
      setLoading(false);
      return;
    }

    // 정상적인 JSON 바디만 파싱
    const newPost: Post = await res.json();
    setPosts([newPost, ...posts]);
    setTitle("");
    setContent("");
    setToastMsg("게시글이 등록되었습니다.");
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={createPost} className="space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용"
          required
          className="w-full border px-3 py-2 rounded h-32"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "작성 중…" : "게시하기"}
        </button>
      </form>
      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.id} className="border p-4 rounded">
            <h3 className="font-bold">{p.title}</h3>
            <p className="text-sm text-gray-500">
              {new Date(p.created_at).toLocaleString()}
            </p>
            <p className="mt-2">{p.content}</p>
          </li>
        ))}
      </ul>
      {toastMsg && (
        <SimpleToast
          message={toastMsg}
          duration={2000}
          onClose={() => setToastMsg(null)}
        />
      )}
    </div>
  );
}
