"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Google from "@/features/auth/auth-google";
import Kakao from "@/features/auth/auth-kakao";
import { useRouter, useSearchParams } from "next/navigation";
import { googleLoginAction } from "../[mode]/actions";
import { useEffect, useState } from "react";
import OpenFindidModal from "@/components/ui/open-findid-modal";
import OpanFindPasswordModal from "@/components/ui/open-findpassword-modal";
import { SimpleToast } from "@/app/components/SimpleToast";

interface AuthFormProps {
  mode: "login" | "register";
}

type Values = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  phone: string;
};

export default function AuthClient({ mode }: AuthFormProps) {
  const [findIdOpen, setFindIdOpne] = useState(false);
  const [findPasswordOpen, setFindPasswordOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  const openFindId = () => setFindIdOpne(true);
  const closeFindId = () => setFindIdOpne(false);
  const openFindPassword = () => setFindPasswordOpen(true);
  const closeFindPassword = () => setFindPasswordOpen(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const toggle = () =>
    router.push(mode === "login" ? "/auth/register" : "/auth/login");

  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>(
    {}
  );

  const labels: Record<keyof Values, string> = {
    name: "이름",
    email: "이메일",
    password: "비밀번호",
    confirmPassword: "비밀번호 확인",
    nickname: "닉네임",
    phone: "전화번호",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    let msg = "";
    if (!value.trim()) {
      msg = `${labels[name as keyof Values]}을(를) 입력해 주세요.`;
    } else {
      if (name === "email") {
        // 1) 이메일 기본 형식 검사
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          msg = "유효한 이메일 형식을 입력해 주세요.";
        }
        // 2) 네이버/구글 도메인 검사
        else if (!/^[^\s@]+@(naver\.com|gmail\.com)$/.test(value)) {
          msg = "네이버 또는 구글 이메일만 사용할 수 있습니다.";
        }
      }
      if (name === "password" && value.length < 6) {
        msg = "비밀번호는 최소 6자 이상이어야 합니다.";
      }
      if (name === "confirmPassword" && value !== values.password) {
        msg = "비밀번호가 일치하지 않습니다.";
      }
      if (name === "phone" && !/^\d{10,11}$/.test(value)) {
        msg = "유효한 전화번호를 입력해 주세요.";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof Values, string>> = {};
    const required: (keyof Values)[] =
      mode === "login"
        ? ["email", "password"]
        : ["name", "email", "password", "confirmPassword", "nickname", "phone"];

    required.forEach((key) => {
      if (!values[key].trim()) {
        if (key === "confirmPassword") {
          newErrors[key] = "비밀번호를 다시 입력해주세요.";
        } else {
          newErrors[key] = `${labels[key]}를 입력해주세요.`;
        }
      }
    });

    // 추가 검증 (형식 등)
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) {
      newErrors.email = "이메일 형식이 올바르지 않습니다.";
    }
    if (values.password && values.password.length < 6) {
      newErrors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
    }
    if (
      mode === "register" &&
      values.confirmPassword &&
      values.confirmPassword !== values.password
    ) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }
    if (
      mode === "register" &&
      values.phone &&
      !/^\d{10,11}$/.test(values.phone)
    ) {
      newErrors.phone = "전화번호는 숫자 11자리여야 합니다.";
    }

    setErrors(newErrors);

    // 에러가 하나라도 있으면 제출 막기
    if (Object.keys(newErrors).length > 0) {
      setToast({ message: "다시 확인해 주세요.", type: "error" });
      return;
    }
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value)
    );

    const res =
      mode === "login"
        ? await (await import("../[mode]/actions")).loginAction(formData)
        : await (await import("../[mode]/actions")).registerAction(formData);

    if (res && typeof res === "object" && "error" in res) {
      if (mode === "login") {
        setErrors({
          email: "메일 주소를 정확히 입력해 주세요. ",
          password: "이메일 또는 비밀번호가 잘못되었습니다.",
        });
      }
      setToast({ message: res.error, type: "warning" });
      return;
    }

    if (mode === "login") {
      router.push("/");
    } else {
      router.push("/auth/login");
    }
  };

  // 메인페이지에서 가져온 모달열기
  useEffect(() => {
    const modal = searchParams.get("modal");
    if (modal === "find-id") setFindIdOpne(true);
    if (modal === "find-password") setFindPasswordOpen(true);
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center gowun bg-[#578E7E]">
      <div className="">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="w-full">
          <div className="logo  mt-0 my-10 flex flex-col items-center text-2xl sm:text-5xl text-[#FFFAEC]">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="hover:text-red-600"
            >
              CAMKEEP
            </button>
            <h2 className="text-sm sm:text-2xl   font-bold">
              {mode === "login" ? "로그인" : "회원가입"}
            </h2>
          </div>

          {/* 이름 */}
          {mode === "register" && (
            <label className="block  text-xs sm:text-base">
              <p className="text-[#FFFAEC]">이름</p>
              <Input
                name="name"
                type="name"
                required
                className="w-full p-2 border rounded"
                value={values.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className=" text-red-500 text-sm">{errors.name}</p>
              )}
            </label>
          )}

          {/* 이메일 */}
          <label className="block pt-1  text-xs sm:text-base">
            <p className="text-[#FFFAEC]">이메일</p>
            <Input
              name="email"
              type="email"
              required
              className="w-full  p-2 border rounded"
              value={values.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className=" text-red-500 text-sm">{errors.email}</p>
            )}
          </label>

          {/* 비밀번호 */}
          <label className="block text-xs sm:text-base pt-2">
            <p className="text-[#FFFAEC]">비밀번호</p>
            <Input
              name="password"
              type="password"
              required
              className="w-full  p-2 border rounded"
              value={values.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className=" text-red-500 text-sm">{errors.password}</p>
            )}
          </label>

          {/* 회원가입 추가 필드 */}
          {mode === "register" && (
            <>
              {/* 비밀번호 확인 */}
              <label className="block  text-xs sm:text-base pt-2">
                <p className="text-[#FFFAEC]">비밀번호 확인</p>
                <Input
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full  p-2 border rounded"
                  value={values.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <p className=" text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </label>

              {/* 닉네임 */}
              <label className="block   text-xs sm:text-base pt-2">
                <p className="text-[#FFFAEC]">닉네임</p>
                <Input
                  name="nickname"
                  type="text"
                  required
                  className="w-full  p-2 border rounded"
                  value={values.nickname}
                  onChange={handleChange}
                />
                {errors.nickname && (
                  <p className=" text-red-500 text-sm">{errors.nickname}</p>
                )}
              </label>

              {/* 전화번호 */}
              <label className="block   text-xs sm:text-base pt-2">
                <p className="text-[#FFFAEC]">전화번호</p>
                <Input
                  name="phone"
                  placeholder="하이픈('-') 없이 숫자만 입력해주세요."
                  type="tel"
                  required
                  className="w-full  p-2 border rounded"
                  value={values.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <p className=" text-red-500 text-sm">{errors.phone}</p>
                )}
              </label>
            </>
          )}

          {mode === "login" && (
            <div className="flex justify-end text-xs mb-10 sm:text-sm text-[#FFFAEC]">
              <button
                type="button"
                onClick={openFindId}
                className="mr-2  hover:text-black"
              >
                아이디 찾기
              </button>
              <OpenFindidModal findIdOpen={findIdOpen} onClose={closeFindId} />|
              <button
                onClick={openFindPassword}
                type="button"
                className="ml-2   hover:text-black"
              >
                비밀번호 변경
              </button>
              <OpanFindPasswordModal
                findPasswordOpen={findPasswordOpen}
                onClose={closeFindPassword}
              />
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="w-full flex justify-center ">
            <Button
              type="submit"
              className="w-80 h-12 flex justify-center bg-[#FFFAEC] text-sm sm:text-base text-[#3D3D3D] py-2 rounded hover:bg-[#c7b29e] hover:text-white transition mt-10"
              onClick={handleSubmit}
            >
              {mode === "login" ? "로그인" : "완료"}
            </Button>
          </div>

          <div className="flex  justify-center text-xs  sm:text-sm text-[#FFFAEC]">
            {mode === "login" ? (
              <>
                <p>아직 회원이 아니신가요?</p>
                <button
                  type="button"
                  onClick={toggle}
                  className="ml-2 hover:text-black hover:font-bold text-xs sm:text-sm"
                >
                  회원가입하기
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
                  로그인하기
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
      {toast && (
        <SimpleToast
          type={toast.type}
          message={toast.message}
          duration={5000}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
