"use client";

import HomeCampingMonth from "@/features/home/home-camping-month";
import HomePromotion from "@/features/home/home-promotion";
import SearchInput from "@/features/search/search-input";

export default function HomeClient() {
  return (
    <>
      <HomeCampingMonth />
      <HomePromotion />
      <SearchInput />
    </>
  );
}
