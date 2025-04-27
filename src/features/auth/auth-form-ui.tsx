"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthFormUI({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 쿼리 파라미터에서 callbackUrl 가져오기 (없으면 '/')
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const toggle = () =>
    router.push(mode === "login" ? "/auth/register" : "/auth/login");

  return (
    <>
      {" "}
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="w-full max-w-md p-6 mx-auto main">
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
        <label className="block mb-4">
          이메일
          <Input
            name="email"
            type="email"
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </label>
        <label className="block mb-4">
          비밀번호
          <Input
            name="password"
            type="password"
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </label>
        {mode === "register" && (
          <>
            <label className="block mb-4">
              비밀번호 확인
              <Input
                name="confirmPassword"
                type="password"
                required
                className="w-full mt-1 p-2 border rounded"
              />
            </label>

            <label className="block mb-4">
              닉네임
              <Input
                name="nickname"
                type="text"
                required
                className="w-full mt-1 p-2 border rounded"
              />
            </label>

            <label className="block mb-4">
              전화번호
              <Input
                name="phone"
                type="tel"
                className="w-full mt-1 p-2 border rounded"
              />
            </label>
          </>
        )}
        <Button
          type="submit"
          className="w-full bg-[#F5ECD5] text-xl text-[#3D3D3D] py-2 rounded hover:bg-[#D4C9BE] hover:text-white transition"
        >
          {mode === "login" ? "로그인" : "회원가입"}
        </Button>
        <div className="flex mt-2 justify-end">
          {mode === "login" ? (
            <>
              <p>아직 회원이 아니신가요?</p>
              <button
                type="button"
                onClick={toggle}
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
                onClick={toggle}
                variant="ghost"
                className="bg-transparent hover:bg-transparent focus:bg-transparent hover:text-red-600"
              >
                로그인
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
