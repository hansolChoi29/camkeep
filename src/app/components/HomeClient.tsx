"use client";

import HomeCampingRecommend from "@/features/home/home-camping-recommend";
import HomeEquipmentRecommend from "@/features/home/home-equipment-recommend";
import HomePromotion from "@/features/home/home-promotion";
import LoginButton from "./LoginButton";

export default function HomeClient() {
  return (
    <div className="">
      <div className="flex flex-col lg:flex-row">
        <HomePromotion />
        <LoginButton />
      </div>
      <HomeCampingRecommend />
      <HomeEquipmentRecommend />
    </div>
  );
}
