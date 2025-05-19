"use client";
import { kakaoLoginAction } from "@/app/auth/[mode]/actions";
import Image from "next/image";

export default function Kakao() {
  const kakaoLogin = async () => {
    try {
      await kakaoLoginAction();
    } catch (err) {}
  };
  return (
    <>
      <button onClick={kakaoLogin}>
        <Image src="/images/kakao.svg" alt="kakao" width={40} height={40} />
      </button>
    </>
  );
}
