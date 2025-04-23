"use client";
import { FormEvent } from "react";

interface AuthFormProps {
  mode: "login" | "register";
  form: { email: string; password: string; nickname: string; phone: string };
  setters: {
    setEmail(v: string): void;
    setPassword(v: string): void;
    setNickname(v: string): void;
    setPhone(v: string): void;
  };
  state: { error: string | null; loading: boolean };
  handleSubmit(e: FormEvent): void;
}

export default function AuthForm({
  mode,
  form: { email, password, nickname, phone },
  setters: { setEmail, setPassword, setNickname, setPhone },
  state: { error, loading },
  handleSubmit,
}: AuthFormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-6 bg-white rounded shadow"
    >
      <h1 className="text-2xl mb-4 capitalize text-center">{mode}</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <label className="block mb-3">
        이메일
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mt-1 p-2 border rounded"
        />
      </label>

      <label className="block mb-3">
        비밀번호
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mt-1 p-2 border rounded"
        />
      </label>

      {mode === "register" && (
        <>
          <label className="block mb-3">
            닉네임
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </label>
          <label className="block mb-3">
            전화번호
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
            />
          </label>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#504B38] text-white py-2 rounded hover:bg-[#cf6e33] transition"
      >
        {loading ? "처리중…" : mode === "login" ? "로그인" : "회원가입"}
      </button>
    </form>
  );
}
