"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Google from "@/features/auth/auth-google";
import Kakao from "@/features/auth/auth-kakao";
import { useRouter, useSearchParams } from "next/navigation";
import { googleLoginAction } from "../[mode]/actions";
import { useState } from "react";
import OpenFindidModal from "@/components/ui/open-findid-modal";
import OpanFindPasswordModal from "@/components/ui/open-findpassword-modal";

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthClient({ mode }: AuthFormProps) {
  const [findIdOpen, setFindIdOpne] = useState(false);
  const [findPasswordOpen, setFindPasswordOpen] = useState(false);

  const openFindId = () => setFindIdOpne(true);
  const closeFindId = () => setFindIdOpne(false);
  const openFindPassword = () => setFindPasswordOpen(true);
  const closeFindPassword = () => setFindPasswordOpen(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const toggle = () =>
    router.push(mode === "login" ? "/auth/register" : "/auth/login");

  return (
    <div className="flex items-center justify-center w-screen gowun h-screen bg-[#578E7E">
      <div className="w-full px-4 max-w-lg space-y-6">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="">
          <div className="logo my-10 flex flex-col items-center text-xl sm:text-5xl text-[#FFFAEC]">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="hover:text-red-600"
            >
              CAMKEEP
            </button>
            <h2 className="text-sm sm:text-2xl mb-4 font-bold">
              {mode === "login" ? "로그인" : "회원가입"}
            </h2>
          </div>
          <label className="block mb-4 text-xs sm:text-base">
            <p className="text-[#FFFAEC]">이름</p>
            <Input
              name="name"
              type="name"
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </label>
          <label className="block mb-4 text-xs sm:text-base">
            <p className="text-[#FFFAEC]">이메일</p>
            <Input
              name="email"
              type="email"
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </label>
          <label className="block  text-xs sm:text-base">
            <p className="text-[#FFFAEC]">비밀번호</p>
            <Input
              name="password"
              type="password"
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </label>
          {mode === "register" && (
            <>
              <label className="block mb-4 text-xs sm:text-base">
                <p className="text-[#FFFAEC]">비밀번호 확인</p>
                <Input
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full mt-1 p-2 border rounded"
                />
              </label>

              <label className="block mb-4 text-xs sm:text-base">
                <p className="text-[#FFFAEC]">닉네임</p>
                <Input
                  name="nickname"
                  type="text"
                  required
                  className="w-full mt-1 p-2 border rounded"
                />
              </label>

              <label className="block mb-4 text-xs sm:text-base">
                <p className="text-[#FFFAEC]">전화번호</p>
                <Input
                  name="phone"
                  type="tel"
                  className="w-full mt-1 p-2 border rounded"
                />
              </label>
            </>
          )}{" "}
          {mode === "login" && (
            <div className="flex justify-end text-xs mb-10 sm:text-sm text-[#FFFAEC]">
              <button onClick={openFindId} className="mr-2  hover:text-black">
                아이디 찾기
              </button>
              <OpenFindidModal findIdOpen={findIdOpen} onClose={closeFindId} />|
              <button
                onClick={openFindPassword}
                className="ml-2   hover:text-black"
              >
                비밀번호 변경
              </button>
              <OpanFindPasswordModal
                findPasswordOpen={findPasswordOpen}
                onClose={closeFindPassword}
              />
            </div>
          )}{" "}
          <div className="w-full flex justify-center ">
            <Button
              type="submit"
              className="w-80 h-12 flex justify-center bg-[#FFFAEC] text-sm sm:text-base text-[#3D3D3D] py-2 rounded hover:bg-[#D4C9BE] hover:text-white transition"
            >
              {mode === "login" ? "로그인" : "완료"}
            </Button>
          </div>
          <div className="flex mt-1 justify-center text-xs mb-10 sm:text-sm text-[#FFFAEC]">
            {mode === "login" ? (
              <>
                <p>아직 회원이 아니신가요?</p>
                <button
                  type="button"
                  onClick={toggle}
                  className="ml-2 hover:text-black hover:font-bold text-xs sm:text-sm"
                >
                  회원가입
                </button>
              </>
            ) : (
              <div className="flex text-xs sm:text-sm justify-center items-center text-[#FFFAEC]">
                <p>이미 계정이 있으신가요?</p>
                <Button
                  type="button"
                  onClick={toggle}
                  variant="ghost"
                  className="bg-transparent text-xs sm:text-sm hover:bg-transparent focus:bg-transparent hover:font-bold hover:text-black"
                >
                  로그인
                </Button>
              </div>
            )}
          </div>
          {mode === "login" && (
            <div className="mt-10">
              <div className="flex items-center text-[#FFFAEC]">
                <div className="flex-1 h-px bg-[#FFFAEC]" />
                <span className="px-4">간편 로그인</span>
                <div className="flex-1 h-px bg-[#FFFAEC]" />
              </div>

              <div className="flex gap-4 justify-center mt-6">
                <Kakao />
                <Google onClick={() => googleLoginAction()} />
              </div>

              <div className="flex justify-center mt-4 text-xs text-[#FFFAEC]">
                <button
                  type="button"
                  className="hover:underline pr-1"
                  onClick={() =>
                    window.open(
                      "https://www.kakao.com/policy/terms?type=a&lang=ko",
                      "_blank"
                    )
                  }
                >
                  이용약관
                </button>
                <span>|</span>
                <button
                  type="button"
                  className="hover:underline pl-1"
                  onClick={() =>
                    window.open(
                      "https://www.kakao.com/policy/privacy",
                      "_blank"
                    )
                  }
                >
                  개인정보처리방침
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
