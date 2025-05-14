import { fetchCampingById } from "@/lib/camping";
import CampingDetailClient from "./components/community-detail.client";

interface Props {
  params: { id: string };
}
export default async function communityDetail({ params: { id } }: Props) {
  const camp = await fetchCampingById(id);
  return <CampingDetailClient camp={camp!} />;
}
