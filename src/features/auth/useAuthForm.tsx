"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/useAuthStore";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function useAuthForm(mode: "login" | "register") {
  const supabase = createClientComponentClient();
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
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    if (mode === "login") {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );
      if (authError) {
        setError(authError.message);
      } else {
        setSession(data.session);
        router.push("/mypage");
      }
    } else {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, nickname, phone }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "회원가입에 실패했습니다.");
      } else {
        router.push("/auth/login");
      }
    }

    setLoading(false);
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
