"use client";

import React, { useState } from "react";
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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface CommunityDetailClientProps {
  post: Post;
}

export default function CommunityDetailClient({
  post,
}: CommunityDetailClientProps) {
  const router = useRouter();

  const initialPhotos: string[] = Array.isArray(post.photos)
    ? post.photos
    : typeof post.photos === "string"
    ? JSON.parse(post.photos)
    : [];
  const [photos, setPhotos] = useState<string[]>(initialPhotos);

  const [openComments, setOpenComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "warning">(
    "success"
  );

  const handleDelete = async () => {
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
      body: JSON.stringify({
        title,
        content,
        photos,
      }),
    });
    if (!res.ok) {
      setToastMsg("수정에 실패했습니다.");
      setToastType("error");
      return;
    }
    setToastMsg("수정이 완료되었습니다.");
    setToastType("success");
    setIsEditing(false);
    router.refresh();
  };

  // 사진 삭제 헬퍼(*중복 방지)
  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <main className="max-w-2xl mx-auto my-12 space-y-6 mb-20">
      <Card className="shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="px-4 py-2">
          {/* 게시글 삭제 버튼 */}
          <div className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="px-3 py-1 rounded hover:bg-gray-100">
                  <Image
                    src="/icons/delete.svg"
                    alt="delete"
                    width={20}
                    height={20}
                  />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    게시글을 삭제하시겠습니까?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    삭제된 게시글은 복구할 수 없습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    삭제
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

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

          {/* 타이틀 & 수정 토글 */}
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
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1 rounded transform transition hover:scale-105"
              aria-label={isEditing ? "취소" : "수정"}
            >
              {isEditing ? (
                <Image
                  src="/icons/close.svg"
                  alt="cancel"
                  width={20}
                  height={20}
                />
              ) : (
                <Image
                  src="/images/update.png"
                  alt="edit"
                  width={20}
                  height={20}
                />
              )}
            </button>
          </div>
        </CardHeader>

        {/* 수정 모드 */}
        {isEditing ? (
          <div className="px-4 py-6 space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border rounded px-2 py-1 h-32"
            />

            {/* 업로드된 사진 목록 + 삭제 버튼 */}
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {photos.map((url, idx) => (
                  <div key={idx} className="relative w-24 h-24">
                    <Image
                      src={url}
                      alt={`photo-${idx}`}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded"
                    />
                    <button
                      onClick={() => removePhoto(idx)}
                      className="absolute top-0 right-0 bg-white rounded-full p-1 shadow"
                      aria-label="사진 삭제"
                    >
                      <Image
                        src="/icons/close.svg"
                        alt="remove"
                        width={16}
                        height={16}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 저장 버튼 */}
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded transform transition hover:scale-105"
            >
              <Image
                src="/icons/check.svg"
                alt="save"
                width={20}
                height={20}
                className="inline mr-1"
              />
              저장
            </button>
          </div>
        ) : (
          /* 조회 모드 */
          <>
            {photos.length > 0 && (
              <div className="w-full h-80 flex justify-center">
                <Image
                  src={photos[0]}
                  alt={post.title}
                  width={500}
                  height={500}
                  className="object-contain"
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

      <Link
        href="/mypage"
        className="inline-block border p-1 bg-[#578E7E] rounded text-white transition hover:scale-105"
      >
        뒤로가기
      </Link>

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
