"use client";
import React, { useState, useEffect } from "react";
import CommunityModal from "@/features/community/community-modal";
import CommunityNewPostForm from "@/features/community/community-newpost-form";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user?: {
    nickname: string;
    photo: string | null;
  };
}

export default function CommunityClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/community")
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(setPosts)
      .catch(() => setError("게시글을 불러오지 못했습니다."));
  }, []);

  const handleNewPost = async (title: string, content: string) => {
    setSubmitting(true);
    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      setModalOpen(false);
      const updated = await (await fetch("/api/community")).json();
      setPosts(updated);
    } else {
      console.error((await res.json()).error);
    }
    setSubmitting(false);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-44 mt-20 sm:mt-44 mb-44">
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      {/* 데스크탑에서만 보이는 게시글 올리기 버튼 */}
      <button
        onClick={() => setModalOpen(true)}
        className="hidden lg:inline-flex items-center  mb-6 bg-[#578E7E] text-black px-4 py-2 rounded hover:bg-[#46715f] transition"
      >
        게시글 올리기
      </button>

      <CommunityModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <CommunityNewPostForm onSubmit={handleNewPost} loading={submitting} />
      </CommunityModal>

      <Accordion type="single" collapsible className="space-y-6 w-full">
        {posts.map((p) => (
          <AccordionItem key={p.id} value={p.id} className="w-full">
            <AccordionTrigger className="w-full bg-white shadow-lg rounded-lg flex items-center justify-between px-6 py-4">
              <div className="flex flex-col items-center space-x-3 w-44">
                {p.user?.photo && (
                  <img
                    src={p.user.photo}
                    alt={p.user.nickname}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <span className="text-lg font-semibold text-[#578E7E]">
                  {p.user && (
                    <span className="text-sm text-gray-400">
                      {p.user.nickname}
                    </span>
                  )}
                </span>
              </div>
              <p className="text-[#578E7E] font-bold w-full flex justify-start">
                {p.title}
              </p>
            </AccordionTrigger>

            <AccordionContent className="w-full bg-white shadow-inner rounded-b-lg border-t px-6 py-4 ">
              <p className="w-full flex justify-end text-[#585858]">
                {new Date(p.created_at).toLocaleDateString()}
              </p>
              <p className="text-black whitespace-pre-wrap break-words">
                {p.content}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
