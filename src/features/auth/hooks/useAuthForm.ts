import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/useAuthStore";

export function useAuthForm(mode: "login" | "register") {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let result;
    if (mode === "login") {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nickname, phone } },
      });
    }

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    // 로그인/회원가입 성공 후 세션을 localStorage에서 가져와 스토어에 저장
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setSession(session);

    router.push("/");
  }

  return {
    form: { email, password, nickname, phone },
    setters: { setEmail, setPassword, setNickname, setPhone },
    state: { error, loading },
    handleSubmit,
  };
}
