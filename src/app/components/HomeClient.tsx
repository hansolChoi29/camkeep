"use client";

import HomeCampingRecommend from "@/features/home/home-camping-recommend";
import HomePromotion from "@/features/home/home-promotion";
import SearchInput from "@/features/search/search-input";

export default function HomeClient() {
  return (
    <>
      <HomePromotion />
      <SearchInput />
      <HomeCampingRecommend />
    </>
  );
}
