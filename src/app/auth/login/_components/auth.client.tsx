"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AuthClient() {
  const router = useRouter();

  const handleHome = () => {
    router.push("/");
  };

  return (
    <main className="logo flex min-h-screen font-sans justify-center items-center  w-full h-full bg-[#FFAB5B] ">
      {/* 이 안의 텍스트는 system‑ui, sans‑serif → 글로벌 폰트 덮어쓰기 */}
      <form onSubmit={handleHome}>
        <div className="flex flex-col items-center mb-24">
          <h1 className="text-[40px]">CAMKEEP</h1>
          <p className="text-[20px] text-[#F5F5DC]">로그인</p>
          <p className="text-[10px] text-[#F5F5DC]">회원정보를 입력해 주세요</p>
        </div>

        <div className="mb-[67px]">
          <p className="text-sm">이메일</p>
          <Input />

          <p className="text-sm">비밀번호</p>
          <Input />
        </div>
        <div className="flex flex-col justify-center items-center">
          <Button type="submit" className="bg-[#F5F5DC] " variant="outline">
            시작
          </Button>
        </div>
      </form>
    </main>
  );
}
