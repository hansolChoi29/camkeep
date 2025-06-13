"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ModalProps {
  findPasswordOpen: boolean;
  onClose: () => void;
}

export default function OpenFindPasswordModal({
  findPasswordOpen,
  onClose,
}: ModalProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");

  // 상태 초기화 함수
  const resetState = () => {
    setStep(1);
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPw("");
    setError("");
    setOtp("");
  };

  // 닫기 처리: 상태 초기화 후 상위 onClose 호출
  const handleClose = () => {
    resetState();
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = findPasswordOpen ? "hidden" : "auto";
    if (!findPasswordOpen) {
      resetState();
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [findPasswordOpen]);

  if (!findPasswordOpen) return null;

  const handleNext = async () => {
    setError("");
    if (step === 1) {
      if (!email || !phone) {
        setError("이메일과 휴대폰 번호를 모두 입력해 주세요.");
        return;
      }
      try {
        // OTP 발급 API 호출
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, phone }),
        });
        const { otp: issuedOtp, error: otpError } = await res.json();
        if (!res.ok) {
          setError(otpError || "OTP 발급에 실패했습니다.");
          return;
        }
        setOtp(issuedOtp); // 받은 OTP 를 상태에 저장
        setStep(2); // 2단계로 넘어감
        return;
      } catch {
        setError("서버 오류가 발생했습니다.");
        return;
      }
    }

    if (step === 2) {
      if (password === "") {
        setError("새 비밀번호를 입력해 주세요.");
        return;
      }
      if (password !== confirmPw) {
        setError("비밀번호가 일치하지 않습니다.");
        return;
      }
      try {
        // 비밀번호 변경 API 호출 (예시)
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp, newPassword: password }),
        });
        if (!res.ok) {
          const { error: resetError } = await res.json();
          setError(resetError || "비밀번호 변경에 실패했습니다.");
          return;
        }
        setStep(3);
      } catch {
        setError("비밀번호 변경에 실패했습니다.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#FFFAEC] text-[#578E7E] rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button onClick={handleClose} className="absolute top-2 right-2 p-1">
          <Image src="/icons/close.svg" alt="close" width={24} height={24} />
        </button>

        {step === 1 && (
          <>
            <h1 className="text-center text-3xl font-bold logo">CAMKEEP</h1>
            <p className="text-center font-bold logo">비밀번호 찾기</p>
            <div className="text-[#875A2C] mb-4">
              <p className="font-bold pb-1">이메일</p>
              <input
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일"
                className="border rounded w-full p-2 placeholder:text-[#b18960] focus:outline-none focus:border-[#875A2C]"
              />
            </div>
            <div className="text-[#875A2C]">
              <p className="font-bold pb-1">전화번호</p>
              <input
                value={phone}
                name="phone"
                onChange={(e) => setPhone(e.target.value)}
                placeholder="전화번호"
                className="border rounded w-full p-2 placeholder:text-[#b18960] focus:outline-none focus:border-[#875A2C]"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-center text-2xl font-bold my-4">
              새 비밀번호 설정
            </h2>
            <div className="text-[#875A2C]">
              <p className="font-bold pb-1">OTP</p>
              <input
                type="text"
                value={otp}
                readOnly
                className="border rounded w-full p-2 placeholder:text-[#875A2C] focus:outline-none focus:border-[#875A2C]"
              />
            </div>
            <p className="text-xs text-red-600 flex justify-end mb-3 mt-1">
              OTP는 자동으로 입력됩니다.
            </p>
            <div className="mb-4 text-[#875A2C]">
              <p className="font-bold pb-1">새 비밀번호</p>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="새 비밀번호"
                className="border rounded w-full p-2 placeholder:text-[#875A2C] focus:outline-none focus:border-[#875A2C]"
              />
            </div>
            <div className="mb-4 text-[#875A2C]">
              <p className="font-bold pb-1">비밀번호 확인</p>
              <input
                type="password"
                name="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="비밀번호 확인"
                className="border rounded w-full p-2 placeholder:text-[#875A2C] focus:outline-none focus:border-[#875A2C]"
              />
            </div>
          </>
        )}

        {step === 3 && (
          <div className="text-center">
            <Image
              src="/icons/check-auth.svg"
              alt="success"
              width={80}
              height={80}
              className="mx-auto my-8"
            />
            <p className="font-semibold">
              비밀번호가 성공적으로 변경되었습니다.
            </p>
            <p className="font-semibold">다시 로그인 해주세요.</p>
          </div>
        )}

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

        <div className="flex justify-center mt-10">
          {step < 3 ? (
            <button
              onClick={handleNext}
              type="button"
              className="bg-[#578E7E] text-white font-bold rounded py-2 px-8"
            >
              완료
            </button>
          ) : (
            <button
              onClick={() => {
                handleClose();
                window.location.reload();
              }}
              type="button"
              className="bg-[#578E7E] text-white font-bold rounded py-2 px-8"
            >
              확인
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
