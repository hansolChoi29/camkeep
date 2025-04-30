"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
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
// import { useAuthStore } from "@/store/useAuthStore";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  photos?: string[];
  user?: { nickname: string; profile: string | null };
}

export default function CommunityClient() {
  // const user = useAuthStore((state) => state.user);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);

  // 게시글 불러오기
  useEffect(() => {
    fetch("/api/community")
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "게시글 조회 실패");
        }
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("올바르지 않은 응답 형식");
        }
        return data as Post[];
      })
      .then(setPosts)
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  // normalize photos 컬럼이 문자열로도 올 수 있어서 배열로 통일
  const normalizePhotos = (photos?: string[] | string | null): string[] => {
    if (Array.isArray(photos)) return photos;
    if (typeof photos === "string") {
      try {
        return JSON.parse(photos);
      } catch {
        return [];
      }
    }
    return [];
  };

  // 새 글 작성 핸들러
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
      // 재조회
      fetch("/api/community")
        .then(async (r) => {
          if (!r.ok) throw new Error("게시글 재조회 실패");
          const d = await r.json();
          return Array.isArray(d) ? d : [];
        })
        .then(setPosts)
        .catch(console.error);
    } else {
      const err = await res.json();
      console.error(err.error);
      setError(err.error);
    }
    setLoadingPost(false);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-32 mt-20 sm:mt-44 mb-44">
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      {/* PC에서만 보이는 '새 글 작성' 버튼 */}
      <button
        onClick={() => setModalOpen(true)}
        className="hidden lg:inline-flex items-center justify-center mb-6
                   border-2 border-[#578E7E] rounded-full p-2
                   hover:bg-[#eefaf6] transition"
      >
        <Image
          src="/images/newpost.png"
          alt="새 글 작성"
          width={24}
          height={24}
        />
      </button>

      {/* 모달 */}
      <CommunityModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <CommunityNewPostForm onSubmit={handleNewPost} loading={loadingPost} />
      </CommunityModal>

      {/* 게시글 리스트 (Accordion) */}
      <Accordion type="single" collapsible className="space-y-6 w-full">
        {posts.map((p) => {
          const photosArr = normalizePhotos(p.photos);

          return (
            <AccordionItem key={p.id} value={p.id} className="w-full">
              <AccordionTrigger className="w-full bg-white shadow-lg rounded-lg flex items-center justify-between px-6 py-4">
                {/* Avatar + Nickname */}
                <div className="flex items-center space-x-3">
                  {p.user?.profile && (
                    <Image
                      src={p.user.profile}
                      alt={p.user.nickname}
                      width={40}
                      height={40}
                      className="object-cover rounded-full"
                    />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {p.user?.nickname}
                </span>

                {/* Title */}
                <span className="text-lg font-semibold text-[#578E7E]">
                  {p.title}
                </span>

                {/* Date */}
                <span className="text-sm text-gray-400">
                  {new Date(p.created_at).toLocaleDateString()}
                </span>
              </AccordionTrigger>

              <AccordionContent className="w-full bg-white shadow-inner rounded-b-lg border-t px-6 py-4">
                {/* 사진 갤러리 */}
                {photosArr.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                    {photosArr.map((url) => (
                      <div key={url} className="w-full">
                        <Image
                          src={url}
                          alt="post photo"
                          width={800}
                          height={600}
                          style={{ objectFit: "contain" }}
                          className="w-full h-auto rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div className="text-gray-800 whitespace-pre-wrap break-words mb-4">
                  {p.content}
                </div>

                {/* 좋아요 + 댓글 */}
                <div className="flex items-center justify-between">
                  <LikeButton postId={p.id} />
                  <CommentsList postId={p.id} />
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
