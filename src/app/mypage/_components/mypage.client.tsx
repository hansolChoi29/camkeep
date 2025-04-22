"use client";

import { authOptions } from "@/lib/auth/session";
import { getServerSession } from "next-auth";
import { useRouter, useSearchParams } from "next/navigation";

interface MypageClientProps {
  email: string;
}

export default function MypageClient({ email }: MypageClientProps) {
  const router = useRouter();
  const params = useSearchParams();
  const callback = params.get("callbackUrl") ?? "/";
  return (
    <section className="w-full sm:max-w-[560px] mx-auto">
      <h2 className="mt-[144px] text-[20px]">Welcome, {email}</h2>
      <button onClick={() => router.push(callback)}>Go back</button>
    </section>
  );
}
