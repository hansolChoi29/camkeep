import { Post } from "@/types/community";
import CommunityClient from "./components/community.client";

export default async function CommunityPage() {
  // 글 목록 패칭
  const postRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/community`,
    { next: { revalidate: 60 } }
  );
  if (!postRes.ok) throw new Error("글 목록 로드 실패");
  const posts: Post[] = await postRes.json();

  // 댓글 수 패칭
  const countsEntries = await Promise.all(
    posts.map(async (p) => {
      const cRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/community/${p.id}/comments`,
        { next: { revalidate: 60 } }
      );
      if (!cRes.ok) return [p.id, 0] as const;
      const comments: unknown[] = await cRes.json();
      return [p.id, comments.length] as const;
    })
  );
  const initialCommentCounts = Object.fromEntries(countsEntries) as Record<
    string,
    number
  >;
  return (
    <CommunityClient
      initialPosts={posts}
      initialCommentCounts={initialCommentCounts}
    />
  );
}
