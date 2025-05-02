// src/components/SearchInput.tsx
"use client";

import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchInput() {
  const router = useRouter();
  const params = useSearchParams();
  // URL에 이미 ?region=XXX 가 있으면 초기값으로 세팅
  const initial = params.get("region") ?? "";
  const [region, setRegion] = useState(initial);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = region.trim();
    if (!r) return;
    // region 파라미터로 push
    router.push(`/search?region=${encodeURIComponent(r)}&pageNo=1`);
  };

  return (
    <form onSubmit={onSubmit} className="flex justify-center mb-4">
      <Input
        name="region"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        placeholder="지역을 입력하세요 (예: 가평)"
        className="w-full max-w-xs px-4 py-2"
      />
    </form>
  );
}
