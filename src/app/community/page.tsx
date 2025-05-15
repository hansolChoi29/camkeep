import { Post } from "@/types/community";
import CommunityClient from "./components/community.client";

export default async function CommunityPage() {
  // 1. 글 목록 패칭
  const postRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/community`,
    { next: { revalidate: 60 } }
  );
  if (!postRes.ok) throw new Error("글 목록 로드 실패");
  const posts: Post[] = await postRes.json();

  // 2. 댓글 수 패칭
  const countsEntries = await Promise.all(
    posts.map(async (p) => {
      // 각 포스트의 댓글 리스트 가져오기 (ISR 옵션: 60초마다 재검증)
      const cRes = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/community/${p.id}/comments`,
        // ISR
        { next: { revalidate: 60 } }
      );
      //  API 호출이 실패했다면 댓글 수를 0으로 처리
      if (!cRes.ok) return [p.id, 0] as const;
      // 댓글 배열을 JSON으로 파싱
      const comments: unknown[] = await cRes.json();
      return [p.id, comments.length] as const;
    })
  );
  // [[id1, cnt1], [id2, cnt2], …] 형태의 튜플 배열을
  // { id1: cnt1, id2: cnt2, … } 형태의 객체로 변환
  const initialCommentCounts = Object.fromEntries(countsEntries) as Record<
    string,
    number
  >;
  // 튜플(tuple)은 서로 다른 타입의 원소들을 고정된 순서와 길이로 담을 수 있는 배열
  // 예) 올바른 할당: 첫 번째 원소는 number, 두 번째 원소는 string
  // let userInfo: [number, string];
  // userInfo = [42, "Hansol"];

  return (
    <CommunityClient
      initialPosts={posts}
      initialCommentCounts={initialCommentCounts}
    />
  );
}
