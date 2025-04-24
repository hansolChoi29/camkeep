"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

interface AuthFormProps {
  mode: "login" | "register";
  form: {
    email: string;
    password: string;
    nickname: string;
    phone: string;
    confirmPassword: string;
  };
  setters: {
    setEmail(v: string): void;
    setPassword(v: string): void;
    setConfirmPassword(v: string): void;
    setNickname(v: string): void;
    setPhone(v: string): void;
  };
  state: { error: string | null; loading: boolean };
  handleSubmit(e: FormEvent): void;
}

export default function AuthForm({
  mode,
  form: { email, password, confirmPassword, nickname, phone },
  setters: { setEmail, setPassword, setConfirmPassword, setNickname, setPhone },
  state: { error, loading },
  handleSubmit,
}: AuthFormProps) {
  const router = useRouter();

  const handleToggleMode = () => {
    router.push(mode === "login" ? "/auth/register" : "/auth/login");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md p-6 mx-auto main">
      <div className="logo flex flex-col items-center text-5xl text-[#FFFAEC]">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="hover:text-red-600"
        >
          CAMKEEP
        </button>

        <h2 className="text-2xl mb-4 font-bold">
          {mode === "login" ? "로그인" : "회원가입"}
        </h2>
      </div>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <label className="block mb-4">
        이메일
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mt-1 p-2 border rounded"
        />
      </label>

      <label className="block mb-4">
        비밀번호
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mt-1 p-2 border rounded"
        />
      </label>

      {mode === "register" && (
        <label className="block mb-4">
          비밀번호 확인
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>
      )}
      {/* 닉네임·전화번호는 register 모드에서만 */}
      {mode === "register" && (
        <>
          <label className="block mb-4">
            닉네임
            <Input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </label>
          <label className="block mb-4">
            전화번호
            <Input
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

      {/* 2) 토글 링크 텍스트도 mode에 따라 바꾸기 */}
      <div className="flex mt-2 justify-end ">
        {mode === "login" ? (
          <>
            <p>아직 회원이 아니신가요?</p>
            <button
              type="button"
              onClick={handleToggleMode}
              className="ml-2 text-black hover:text-red-700"
            >
              회원가입
            </button>
          </>
        ) : (
          <div className="flex justify-center items-center">
            <p>이미 계정이 있으신가요?</p>
            <Button
              type="button"
              onClick={handleToggleMode}
              variant="ghost"
              className="bg-transparent hover:bg-transparent focus:bg-transparent hover:text-red-600"
            >
              로그인
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
