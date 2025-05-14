import { fetchCampingById } from "@/lib/camping";
import CampingDetailClient from "./components/camping-detail.client";
import { notFound } from "next/navigation";

interface CampingDetailPageProps {
  params: { id: string };
}

export default async function CampingDetailPage({
  params: { id },
}: CampingDetailPageProps) {
  const camp = await fetchCampingById(Number(id));
  if (!camp) return notFound();
  // 클라이언트 컴포넌트에 camp props 전달
  // return <CampingDetailClient />;
  return <CampingDetailClient camp={camp} />;
}
