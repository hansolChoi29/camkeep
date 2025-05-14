"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import CommentsList from "@/features/community/community-list";
import LikeButton from "@/features/community/like-button";
import { timeAgo } from "@/lib/utils";
import { Post } from "@/types/community";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";



interface CommunityDetailClientProps {
  post: Post;
}

export default function CommunityDetailClient({
  post,
}: CommunityDetailClientProps) {
  const [openComments, setOpenComments] = useState(false);

  const photos = Array.isArray(post.photos)
    ? post.photos
    : typeof post.photos === "string"
    ? JSON.parse(post.photos)
    : [];

  return (
    <main className="max-w-2xl mx-auto my-12 space-y-6">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="flex items-center px-4 py-2">
          {post.user?.profile && (
            <Image
              src={post.user.profile}
              alt={post.user.nickname}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          )}
          <div className="ml-3">
            <p className="font-medium">
              {post.user?.nickname || "익명 사용자"}
            </p>
            <p className="text-xs text-gray-500">{timeAgo(post.created_at)}</p>
          </div>
        </CardHeader>

        {photos.length > 0 && (
          <div className=" w-full h-80">
            <Image
              src={photos[0]}
              alt={post.title}
              fill
              className="object-contain"
            />
          </div>
        )}

        <CardContent className="px-4 py-6">
          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          <p className=" whitespace-pre-wrap">{post.content}</p>
        </CardContent>

        <CardFooter className="px-4 py-2 flex justify-between items-center border-t">
          <LikeButton postId={post.id} />
          <button
            onClick={() => setOpenComments((prev) => !prev)}
            className="text-sm text-[#578E7E] hover:underline"
          >
            {openComments ? "댓글 숨기기" : "댓글 보기"}
          </button>
        </CardFooter>

        {openComments && (
          <div className="px-4 pb-4">
            <CommentsList postId={post.id} />
          </div>
        )}
      </Card>
      <div>
        <Link
          href="/mypage"
          className="border p-1 bg-[#578E7E] rounded text-white"
        >
          뒤로가기
        </Link>
      </div>
    </main>
  );
}
