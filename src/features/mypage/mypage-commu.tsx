"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";

interface PostSummary {
  id: string;
  title: string;
  created_at: string;
}

interface MypageCommuProps {
  initialPosts: PostSummary[];
}

export default function MypageCommu({ initialPosts }: MypageCommuProps) {
  if (!initialPosts || initialPosts.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        작성한 게시물이 없습니다.
      </div>
    );
  }

  return (
    <section className="w-full space-y-6 my-8 gowun">
      <h2 className="text-xl font-semibold mb-4">내가 게시한 글</h2>
      <Card className="w-full">
        <ul>
          {initialPosts.map((post) => (
            <li
              key={post.id}
              className="flex justify-between items-center p-2 "
            >
              <Link
                href={`/community/${post.id}`}
                className="font-medium hover:underline"
              >
                {post.title}
              </Link>
              <span className="text-xs ml-2">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
