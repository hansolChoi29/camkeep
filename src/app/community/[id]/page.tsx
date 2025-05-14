import CommunityDetailClient from "./components/community-detail.client";
import { serverSupabase } from "@/lib/supabase/server";
import { Post } from "@/types/community";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export default async function CommunityDetail({ params: { id } }: Props) {
  const supabase = serverSupabase();
  const { data: post, error } = await supabase
    .from<Post>("community_posts")
    .select(
      `
      id,
      title,
      content,
      created_at,
      photos,
      user:users (
        nickname,
        profile
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !post) {
    notFound();
  }
  return <CommunityDetailClient post={post} />;
}
