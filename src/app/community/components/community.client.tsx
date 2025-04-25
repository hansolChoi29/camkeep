// src/app/community/components/community.client.tsx
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@supabase/auth-helpers-react";
import CommunityModal from "@/features/community/community-modal";
import CommunityNewPostForm from "@/features/community/community-newpost-form";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import LikeButton from "@/features/community/like-button";
import CommentsList from "@/features/community/community-list";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  photos?: string[];
  user?: { nickname: string; photo: string | null };
}

export default function CommunityClient() {
  const user = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);

  const fetchPosts = () => {
    fetch("/api/community")
      .then((r) => r.json())
      .then(setPosts)
      .catch(() => setError("게시글을 불러오지 못했습니다."));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNewPost = async (
    title: string,
    content: string,
    photos: string[]
  ) => {
    setLoadingPost(true);
    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, photos }),
    });
    if (res.ok) {
      setModalOpen(false);
      fetchPosts();
    } else {
      console.error((await res.json()).error);
    }
    setLoadingPost(false);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-32 mt-20 sm:mt-44 mb-44">
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      <button
        onClick={() => setModalOpen(true)}
        className="hidden lg:inline-flex mb-6 rounded transition"
      >
        <Image src="/images/newpost.png" alt="newpost" width={40} height={40} />
      </button>

      <CommunityModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <CommunityNewPostForm onSubmit={handleNewPost} loading={loadingPost} />
      </CommunityModal>

      <Accordion type="single" collapsible className="space-y-6 w-full">
        {posts.map((p) => {
          const photos = p.photos ?? [];
          return (
            <AccordionItem key={p.id} value={p.id} className="w-full">
              <AccordionTrigger className="w-full bg-white shadow-lg rounded-lg flex items-center justify-between px-6 py-4">
                <div className="flex flex-col items-center space-x-3">
                  {p.user?.photo && (
                    <Image
                      src={p.user.photo}
                      alt={p.user.nickname}
                      width={40}
                      height={40}
                      className="rounded-full h-10 w-10"
                    />
                  )}
                  <span className="flex items-center space-x-2 text-sm text-black">
                    {p.user?.nickname}
                  </span>
                </div>
                <div className="   text-lg font-semibold text-[#578E7E]">
                  <span>{p.title} </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="w-full bg-white shadow-inner rounded-b-lg border-t px-6 py-4">
                {/* 사진 갤러리 */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                    {photos.map((url) => (
                      <div key={url} className="relative w-full h-32">
                        <Image
                          src={url}
                          alt="post photo"
                          fill
                          style={{ objectFit: "cover" }}
                          className="rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <p className="w-full flex justify-end text-[#585858]">
                  {" "}
                  <span>{new Date(p.created_at).toLocaleDateString()}</span>
                </p>
                <p className="text-black whitespace-pre-wrap break-words mb-4">
                  {p.content}
                </p>

                <div className="flex items-center justify-between">
                  <LikeButton postId={p.id} />
                  <CommentsList postId={p.id} currentUser={user} />
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
