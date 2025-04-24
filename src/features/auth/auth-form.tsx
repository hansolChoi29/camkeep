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
      className="w-full max-w-md  sm:px-0 mx-auto p-6 text-[#3D3D3D]"
    >
      <h1 className="logo text-5xl flex items-center justify-center">
        CAMKEEP
      </h1>
      <h2 className="text-2xl mb-4 font-bold text-center">로그인</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="main">
        <label className="block mb-4">
          이메일
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 p-2 border rounded        "
          />
        </label>

        <label className="block mb-4">
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
            <label className="block mb-4">
              닉네임
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                className="w-full mt-1 p-2 border rounded"
              />
            </label>
            <label className="block mb-4">
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
          className="w-full bg-[#F5ECD5] text-xl text-[#3D3D3D] py-2 rounded hover:bg-[#D4C9BE] hover:text-white transition"
        >
          {loading ? "처리중…" : mode === "login" ? "로그인" : "회원가입"}
        </button>
      </div>
    </form>
  );
}
