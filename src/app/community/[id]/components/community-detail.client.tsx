"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { SimpleToast } from "@/app/components/SimpleToast";
interface CommunityDetailClientProps {
  post: Post;
}

export default function CommunityDetailClient({
  post,
}: CommunityDetailClientProps) {
  const [openComments, setOpenComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "warning">(
    "success"
  );

  const router = useRouter();

  const photos = Array.isArray(post.photos)
    ? post.photos
    : typeof post.photos === "string"
    ? JSON.parse(post.photos)
    : [];

  const handleDelete = async () => {
    if (!confirm("정말 이 게시글을 삭제하시겠습니까?")) return;
    setToastType("warning");
    const res = await fetch(`/api/community/${post.id}/commu`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      setToastMsg("삭제에 실패했습니다.");
      setToastType("error");
      return;
    }
    router.push("/mypage");
    setToastMsg("게시글이 삭제되었습니다.");
    setToastType("success");
  };

  const handleSave = async () => {
    const res = await fetch(`/api/community/${post.id}/commu`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (!res.ok) {
      setToastMsg("수정에 실패했습니다.");
      return;
    }
    setToastMsg("수정이 완료되었습니다.");
    setIsEditing(false);
    router.refresh();
  };

  return (
    <main className="max-w-2xl mx-auto my-12 space-y-6">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="px-4 py-2">
          {/* 작성자 정보 */}
          <div className="flex items-center mb-2">
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
              <p className="text-xs text-gray-500">
                {timeAgo(post.created_at)}
              </p>
            </div>
          </div>

          {/* 타이틀 + 수정/삭제 버튼 */}
          <div className="flex justify-between items-center">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 border rounded px-2 py-1 mr-4"
              />
            ) : (
              <h2 className="text-xl font-semibold">{post.title}</h2>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3 py-1 bg-[#578E7E] text-white rounded transform transition hover:scale-105"
              >
                {isEditing ? "취소" : "수정"}
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-[#FFAB5B] text-white rounded transform transition hover:scale-105"
              >
                삭제
              </button>
            </div>
          </div>
        </CardHeader>

        {isEditing ? (
          <div className="px-4 py-6 space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded px-2 py-1 h-32"
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#578E7E] text-white rounded transform transition hover:scale-105"
            >
              저장
            </button>
          </div>
        ) : (
          <>
            {photos.length > 0 && (
              <div className="w-full h-80 justify-center flex">
                <Image
                  src={photos[0]}
                  alt={post.title}
                  width={500}
                  height={500}
                />
              </div>
            )}
            <CardContent className="px-4">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </CardContent>
            <CardFooter className="px-4 py-2 flex justify-between items-center border-t">
              <LikeButton postId={post.id} />
              <button
                onClick={() => setOpenComments(!openComments)}
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
          </>
        )}
      </Card>

      <div>
        <Link
          href="/mypage"
          className="inline-block border p-1 bg-[#578E7E] rounded text-white transform transition hover:scale-105"
        >
          뒤로가기
        </Link>
      </div>

      {toastMsg && (
        <SimpleToast
          type={toastType}
          message={toastMsg}
          duration={2000}
          onClose={() => setToastMsg(null)}
        />
      )}
    </main>
  );
}
