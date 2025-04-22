import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export function useAuthForm(mode: "login" | "register") {
  const setSession = useAuthStore((s) => s.setSession);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload: any = { email, password };
    if (mode === "register") {
      payload.nickname = nickname;
      payload.phone = phone;
    }
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (!res.ok) {
      const { error: msg } = await res.json();
      setError(msg || "알 수 없는 오류");
      return;
    }
    router.push("/");
  };

  return {
    form: { email, password, nickname, phone },
    setters: { setEmail, setPassword, setNickname, setPhone },
    state: { error, loading },
    handleSubmit,
  };
}
