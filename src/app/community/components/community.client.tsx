"use client";
import React, { useState, useEffect } from "react";
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

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  photos?: string[];
  user?: { nickname: string; profile: string | null };
}

export default function CommunityClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/community")
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || "조회 실패");
        return res.json() as Promise<Post[]>;
      })
      .then(setPosts)
      .catch((err) => setError(err.message));
  }, []);

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
      const refreshed = await fetch("/api/community").then((r) => r.json());
      setPosts(refreshed);
    } else {
      const err = await res.json();
      setError(err.error);
    }
    setLoadingPost(false);
  };

  const toggleComments = (postId: string) =>
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));

  return (
    <div className="max-w-xl mx-auto mt-20 space-y-6 mb-20">
      {error && <div className="text-red-500">{error}</div>}
      <button
        onClick={() => setModalOpen(true)}
        className="hidden lg:inline-flex fixed bottom-8 right-8 bg-[#578E7E] text-white p-4 rounded-full shadow-lg hover:bg-[#3d665e] transition"
        aria-label="새 글 작성"
      >
        +
      </button>
      <CommunityModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <CommunityNewPostForm onSubmit={handleNewPost} loading={loadingPost} />
      </CommunityModal>

      {posts.map((p) => {
        const photos = normalizePhotos(p.photos);
        return (
          <Card key={p.id} className="rounded-lg overflow-hidden shadow-md">
            <CardHeader className="flex flex-row items-center px-2 py-1 ">
              {p.user?.profile && (
                <Image
                  src={p.user.profile}
                  alt={p.user.nickname}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              )}
              <div className=" flex justify-center items-center">
                <p className="font-medium">{p.user?.nickname}</p>
              </div>
            </CardHeader>

            {photos[0] && (
              <div className="relative w-full h-64">
                <Image
                  src={photos[0]}
                  alt="post photo"
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded"
                />
              </div>
            )}
            <div className="flex justify-end">
              <p className="text-xs text-gray-500 mr-2">
                {new Date(p.created_at).toLocaleString()}
              </p>
            </div>
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
                {openComments[p.id] ? "댓글 숨기기" : "댓글 보기"}
              </button>
            </CardFooter>

            {openComments[p.id] && (
              <div className="px-4 pb-4">
                <CommentsList postId={p.id} />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
