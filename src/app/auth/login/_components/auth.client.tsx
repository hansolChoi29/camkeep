"use client";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AuthClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push("/");
    }
  };
  return (
    <main className=" flex min-h-screen font-sans justify-center items-center  w-full h-full bg-[#FFAB5B] ">
      {/* 이 안의 텍스트는 system‑ui, sans‑serif → 글로벌 폰트 덮어쓰기 */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center mb-24">
          <h1 className="logo text-[40px]">CAMKEEP</h1>
          <p className="text-[20px] text-[#F5F5DC]">로그인</p>
          <p className="text-[10px] text-[#F5F5DC]">회원정보를 입력해 주세요</p>
        </div>

        <div className="mb-[67px]">
          <p className="text-sm">이메일</p>
          <Input
            type="email"
            className="mt-1 block w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <p className="text-sm">비밀번호</p>
          <Input
            type="password"
            className="mt-1 block w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <Button
            disabled={loading}
            type="submit"
            className="bg-[#F5F5DC] "
            variant="outline"
          >
            {loading ? "로딩중…" : "시작"}
          </Button>
        </div>
      </form>
    </main>
  );
}
