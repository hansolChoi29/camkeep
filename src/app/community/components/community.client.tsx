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
        if (!res.ok) throw new Error(`GET 에러 ${res.status}`);
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
      body: JSON.stringify({ title, content, user_id: user.id }),
    });

    const raw = await res.text();

    if (!res.ok) {
      // raw가 JSON 형태면 파싱, 아니면 그대로 메시지로
      let errMsg: string;
      try {
        const parsed = JSON.parse(raw);
        errMsg = parsed.error || JSON.stringify(parsed);
      } catch {
        errMsg = raw;
      }
      console.log("💡 status:", res.status);
      console.error("POST 에러:", errMsg);
      console.log("💡 raw response:", raw);
      setToastMsg("게시글 등록에 실패했습니다.");

      setLoading(false);

      return;
    }

    // 성공 케이스도 같은 raw를 파싱
    let newPost: Post;

    try {
      newPost = JSON.parse(raw);
    } catch (e) {
      console.error("POST 응답 JSON 파싱 실패:", e);
      setToastMsg("응답을 처리하지 못했습니다.");
      setLoading(false);
      return;
    }

    setPosts([newPost, ...posts]);
    setTitle("");
    setContent("");
    setToastMsg("게시글이 등록되었습니다.");
    setLoading(false);
  };

  return (
    <div className="flex flex-col w-screen h-screen px-2 sm:px-32 mt-20 sm:mt-44">
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
      <div className="fixed bottom-0 left-0  bg-white border-t p-4 shadow-lg z-50">
        <form onSubmit={createPost} className="space-y-2 ">
          <div className="w-full flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#578E7E] text-white p-1  rounded  "
            >
              {loading ? "작성 중…" : "게시하기"}
            </button>
          </div>
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
        </form>
      </div>
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
