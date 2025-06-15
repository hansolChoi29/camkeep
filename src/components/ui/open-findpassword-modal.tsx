"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

interface ModalProps {
  findPasswordOpen: boolean;
  onClose: () => void;
}

export default function OpenFindPasswordModal({
  findPasswordOpen,
  onClose,
}: ModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (findPasswordOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [findPasswordOpen]);

  useEffect(() => {
    if (step === 1 && emailRef.current) {
      emailRef.current.focus();
      emailRef.current.select();
    } else if (step === 2 && phoneRef.current) {
      phoneRef.current.focus();
      phoneRef.current.select();
    } else if (step === 3 && passwordRef.current) {
      passwordRef.current.focus();
      passwordRef.current.select();
    }
  }, [step]);

  const resetAll = () => {
    setStep(1);
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPw("");
    setOtp("");
    setError("");
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const handleNext = async () => {
    setError("");

    if (step === 1 && email) {
      setStep(2);
    } else if (step === 2 && phone) {
      try {
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, phone }),
        });
        const { otp: issuedOtp, error: otpError } = await res.json();
        if (!res.ok) {
          setError(otpError || "OTP 발급 실패");
          return;
        }
        setOtp(issuedOtp);
        setStep(3);
      } catch {
        setError("서버 오류");
      }
    } else if (step === 3) {
      if (!password || !confirmPw) {
        setError("비밀번호를 모두 입력해주세요.");
        return;
      }
      if (password !== confirmPw) {
        setError("비밀번호가 일치하지 않습니다.");
        return;
      }

      try {
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp, newPassword: password }),
        });
        const { error: resetError } = await res.json();
        if (!res.ok) {
          setError(resetError || "비밀번호 변경 실패");
          return;
        }
        setStep(4);
      } catch {
        setError("비밀번호 변경 실패");
      }
    } else {
      setError("모든 값을 입력해주세요.");
    }
  };

  if (!findPasswordOpen) return null;

  return (
    <div
      tabIndex={-1}
      onKeyDownCapture={(e) => {
        if (e.key === "Enter") handleNext();
      }}
      className="bg-black bg-opacity-50 fixed inset-0 text-[#578E7E] flex justify-center items-center z-50 bg-transparent"
    >
      <div
        className="w-full h-screen
             max-w-lg 
            sm:h-[460px] sm:rounded-xl
             bg-[#FFFAEC] text-[#578E7E] shadow-lg h-rounded-none sm:p-6 relative flex flex-col "
      >
        <div
          className="sm:hidden block bg-[#578E7E] text-white
        absolute top-0 left-0 w-full
        "
        >
          <p className="flex justify-center items-center text-xl p-4">
            비밀번호 변경
          </p>
        </div>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hidden sm:block"
        >
          <Image src="/icons/close.svg" alt="close" width={24} height={24} />
        </button>
        <button
          onClick={handleClose}
          className="absolute top-5 left-4 text-gray-500 sm:hidden block"
        >
          <Image src="/icons/back.svg" alt="close" width={24} height={24} />
        </button>

        <div className="sm:px-0 px-6 mt-20">
          {step === 1 && (
            <div className="mb-10">
              <p className="text-xl sm:text-2xl font-bold hidden sm:block">
                비밀번호 변경
              </p>
              <p className="logo sm:hidden block text-2xl">CAMKEEP</p>
              <p className="sm:text-sm text-base sm:font-normal font-bold">
                가입정보를 입력해 주세요.
              </p>
            </div>
          )}
          {step === 2 && (
            <div className="sm:mb-10 mb-20">
              <p className="text-xl sm:text-2xl font-bold hidden sm:block">
                비밀번호 변경
              </p>
              <p className="logo sm:hidden block text-2xl">CAMKEEP</p>
              <p className="sm:text-sm text-base sm:font-normal font-bold">
                가입정보를 입력해 주세요.
              </p>
            </div>
          )}
          {step === 3 && (
            <div className="sm:mb-0 mb-10">
              <p className="text-xl sm:text-2xl font-bold hidden sm:block">
                비밀번호 변경
              </p>
              <p className="logo sm:hidden block text-2xl">CAMKEEP</p>
              <p className="sm:text-sm text-base sm:font-normal font-bold">
                가입정보를 입력해 주세요.
              </p>
              <p>거의 완료되었어요!</p>
            </div>
          )}
        </div>
        <div className="sm:mt-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                className="mb-20 sm:px-0 px-6 sm:mt-0 mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onAnimationComplete={() => {
                  if (emailRef.current) {
                    emailRef.current.focus();
                    emailRef.current.select();
                  }
                }}
              >
                <Input
                  ref={emailRef}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력해 주세요."
                  className="placeholder:text-[#875A2C] text-sm p-3"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 sm:mb-4 mb-20 sm:px-0 px-6"
                onAnimationComplete={() => {
                  if (phoneRef.current) {
                    phoneRef.current.focus();
                    phoneRef.current.select();
                  }
                }}
              >
                <div className="text-sm text-[#875A2C] bg-[#F5F0E6] rounded-full px-4 py-1 inline-block">
                  {email}
                </div>
                <Input
                  ref={phoneRef}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="전화번호 (하이픈 없이)"
                  className="placeholder:text-[#875A2C] text-sm p-3 "
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-10  sm:px-0 px-6"
                onAnimationComplete={() => {
                  if (passwordRef.current) {
                    passwordRef.current.focus();
                    passwordRef.current.select();
                  }
                }}
              >
                <Input
                  type="text"
                  value={otp}
                  readOnly
                  className="bg-gray-100 text-center font-mono tracking-widest text-[#875A2C] "
                />
                <p className="text-xs text-red-500 text-end pb-2">
                  OTP는 자동 입력됩니다.
                </p>

                <Input
                  ref={passwordRef}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="새 비밀번호 (6자 이상)"
                  className="placeholder:text-[#875A2C] text-sm p-3 mb-2"
                />

                <Input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="비밀번호 확인"
                  disabled={password.length < 6}
                  className={`text-sm p-3  ${
                    password.length < 6
                      ? "bg-gray-100 opacity-50 cursor-not-allowed"
                      : "bg-white"
                  }`}
                />

                {error && <p className="text-red-500 text-sm pl-1">{error}</p>}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                className="flex-col flex justify-center items-center sm:mb-1 mb-10 sm:mt-0 mt-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="pb-10">
                  <Image
                    src="/icons/check-auth.svg"
                    alt="완료"
                    width={70}
                    height={70}
                  />
                </div>
                <div className="flex flex-col justify-center items-center text-[#875A2C] text-sm sm:text-base">
                  <p>비밀번호가 성공적으로 변경되었습니다.</p>
                  <p>다시 로그인 해주세요.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="sm:absolute bottom-6 left-0 w-full flex justify-center">
          <button
            onClick={step === 4 ? handleClose : handleNext}
            className="px-24 bg-[#578E7E] text-white font-semibold py-3 rounded text-base"
          >
            {step === 1 ? "다음" : step === 2 ? "완료" : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}
