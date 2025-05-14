import { fetchCampingById } from "@/lib/camping";
import { notFound } from "next/navigation";
import CampingDetailClient from "./components/camping.client";

interface CampingDetailPageProps {
  params: { id: string };
}

export default async function CampingDetailPage({
  params: { id },
}: CampingDetailPageProps) {
  const camp = await fetchCampingById(id);
  // 데이터는 잘 들어오는데 왜 항상 null로 인식할까?=> 404This page could not be found.=>fetchCampingById(id)가 null을 리턴
  if (!camp) return notFound();

  return <CampingDetailClient camp={camp} />;
}
