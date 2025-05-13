"use client";

import HomeCampingRecommend from "@/features/home/home-camping-recommend";
import HomeEquipmentRecommend from "@/features/home/home-equipment-recommend";
import HomePromotion from "@/features/home/home-promotion";

export default function HomeClient() {
  return (
    <>
      <HomePromotion />
      <HomeCampingRecommend />
      <HomeEquipmentRecommend />
    </>
  );
}
