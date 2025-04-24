"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/useAuthStore";

export function useAuthForm(mode: "login" | "register") {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "register" && password !== confirmPassword) {
      setLoading(false);
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, nickname, phone }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "알 수 없는 오류");
      return;
    }

    // 쿠키에 세션이 저장되었으므로 서버에서 다시 불러와 스토어에 싱크
    const { data } = await supabase.auth.getSession();
    setSession(data.session);

    router.push("/mypage");
  };

  return {
    form: { email, password, confirmPassword, nickname, phone },
    setters: {
      setEmail,
      setPassword,
      setConfirmPassword,
      setNickname,
      setPhone,
    },
    state: { error, loading },
    handleSubmit,
  };
}
