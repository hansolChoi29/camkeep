import CommunityDetailClient from "./components/community-detail.client";

async function getPostById(id: string) {
  const res = await fetch(`/api/community/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("포스트를 불러오는데 실패했습니다.");
  return res.json();
}

export default async function CommunityDetail({ params: { id } }) {
  const post = await getPostById(id);
  return <CommunityDetailClient post={post} />;
}
