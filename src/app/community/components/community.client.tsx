"use client";
import React, { useState } from "react";
import Image from "next/image";
import CommunityModal from "@/features/community/community-modal";
import CommunityNewPostForm from "@/features/community/community-newpost-form";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import LikeButton from "@/features/community/like-button";
import CommentsList from "@/features/community/community-list";
import { timeAgo } from "@/lib/utils";
import { Post } from "@/types/community";

interface CommunityClientProps {
  initialPosts: Post[];
  initialCommentCounts: Record<string, number>;
}

export default function CommunityClient({
  initialPosts,
  initialCommentCounts,
}: CommunityClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [commentCounts, setCommentCounts] = useState(initialCommentCounts);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});

  // console.log("setCommentCounts", setCommentCounts);

  // 사진 데이터(문자열 또는 배열)를 string[] 으로 정규화하는 함수
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

  // 새 글 작성 요청을 보내고, 성공 시 목록을 재조회하여 상태를 갱신하는 비동기 함수
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
      // 게시 성공 후 글 목록 재조회
      const refreshed = await fetch("/api/community").then((r) => r.json());
      setPosts(refreshed);
    } else {
      const err = await res.json();
      setError(err.error);
    }
    setLoadingPost(false);
  };

  // 특정 포스트의 댓글 보기/숨기기 상태를 토글하는 함수
  const toggleComments = (postId: string) =>
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));

  // 댓글이 새로 달렸을 때 count를 +1 해 주는 함수
  const handleCommentAdded = (postId: string) => {
    setCommentCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] ?? 0) + 1,
    }));
  };

  return (
    <div className="mt-10 sm:mt-20 mb-20 ">
      {error && <div className="text-red-500">{error}</div>}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-2 right-8  mb-2        
    sm:static sm:bottom-auto sm:right-auto  
    inline-flex items-center justify-center
    text-sm sm:text-base text-white bg-white border
     p-2 sm:border-none rounded-full 
    transition z-50"
        aria-label="새 글 작성"
      >
        <Image
          src="/icons/write.svg"
          alt="새 글 작성"
          width={37}
          height={48}
          className="sm:w-10 w-8 "
        />
      </button>
      <CommunityModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <CommunityNewPostForm onSubmit={handleNewPost} loading={loadingPost} />
      </CommunityModal>

      {posts.map((p) => {
        const photos = normalizePhotos(p.photos);
        return (
          <Card key={p.id} className=" rounded-lg overflow-hidden shadow-md ">
            <div className="flex ">
              <div className="w-full ">
                <div>
                  <CardHeader className="flex flex-row items-center h-full px-4">
                    {p.user?.profile && (
                      <Image
                        src={p.user.profile}
                        alt={p.user.nickname}
                        width={33}
                        height={33}
                        className="rounded-full h-8 object-cover border"
                      />
                    )}

                    <div>
                      <p className="font-medium p-1 text-sm ml-1">
                        {p.user?.nickname}
                      </p>
                    </div>
                  </CardHeader>
                </div>
                <div className="flex items-center justify-between  px-4 py-1">
                  <p className="justify-start ">{p.title}</p>
                  <p className="text-xs ml-2 text-[#A7A6A6]">
                    {timeAgo(p.created_at)}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full px-4">
              <hr />
            </div>
            {photos[0] && (
              <div className="relative w-full h-64 mt-4">
                <Image
                  src={photos[0]}
                  alt="post photo"
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded"
                />
              </div>
            )}

            <CardContent className="px-4 py-2">
              <p className="">
                {p.content.length > 100
                  ? `${p.content.slice(0, 100)}...`
                  : p.content}
              </p>
            </CardContent>
            <CardFooter className="px-4 py-2 flex items-center justify-between">
              <LikeButton postId={p.id} />
              <button
                onClick={() => toggleComments(p.id)}
                className="text-sm text-[#578E7E] hover:underline"
              >
                {openComments[p.id]
                  ? "댓글 숨기기"
                  : `댓글 보기 (${commentCounts[p.id] ?? 0})`}
              </button>
            </CardFooter>

            {openComments[p.id] && (
              <div className="px-4 pb-4">
                <CommentsList
                  postId={p.id}
                  onCommentAdded={() => handleCommentAdded(p.id)}
                />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
