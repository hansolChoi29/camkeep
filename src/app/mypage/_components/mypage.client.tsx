"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/useAuthStore";

interface MypageClientProps {
  email: string;
  nickname: string;
  phone: string;
}

export default function MypageClient({
  email,
  nickname,
  phone,
}: MypageClientProps) {
  const router = useRouter();
  const params = useSearchParams();
  const clearSession = useAuthStore((s) => s.clearSession);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      clearSession();
      router.push("/auth/login");
    }
  };

  const callback = params.get("callbackUrl") ?? "/";

  return (
    <section className="w-full sm:max-w-[560px] mx-auto">
      <h2 className="mt-[144px] text-[20px]"> {email}</h2>
      <p className="mt-2">닉네임: {nickname}</p>
      <p>전화번호: {phone}</p>

      <div className="mt-8 flex space-x-4">
        <button onClick={() => router.push(callback)}>Go back</button>
        <button onClick={handleLogout}>로그아웃</button>
      </div>
    </section>
  );
}
