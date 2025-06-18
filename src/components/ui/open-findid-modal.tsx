"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Input } from "@/components/ui/input";

interface ModalProps {
  findIdOpen: boolean;
  onClose: () => void;
}

export default function OpenFindidModal({ findIdOpen, onClose }: ModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const phoneRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (findIdOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [findIdOpen]);

  useEffect(() => {
    if (step === 1 && nameRef.current) {
      nameRef.current.focus();
      nameRef.current.select();
    } else if (step === 2 && phoneRef.current) {
      phoneRef.current.focus();
      phoneRef.current.select();
    }
  }, [step]);

  const handleNameSubmit = () => {
    if (!name.trim()) {
      setError("이름을 입력해 주세요.");
      return;
    }
    setStep(2);
    setError("");
  };

  const handlePhoneSubmit = async () => {
    if (!phone.trim()) {
      setError("전화번호를 입력해 주세요.");
      return;
    }
    setError("");

    try {
      const res = await fetch("/api/auth/find-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "이메일을 찾을 수 없습니다.");
        return;
      }
      setEmail(data.email);
      setStep(3);
    } catch {
      setError("서버 오류가 발생했습니다.");
    }
  };

  const handleComplete = () => {
    setStep(1);
    setName("");
    setPhone("");
    setEmail("");
    setError("");
    setCopied(false);
    onClose();
  };

  if (!findIdOpen) return null;

  return (
    <div
      tabIndex={-1}
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
      onKeyDownCapture={(e) => {
        if (e.key === "Enter") {
          if (step === 1) handleNameSubmit();
          if (step === 2) handlePhoneSubmit();
        }
      }}
    >
      <div
        className="w-full h-screen
             max-w-lg 
            sm:h-[460px] sm:rounded-xl
             bg-[#FFFAEC] text-[#578E7E] shadow-lg h-rounded-none sm:p-6  relative flex flex-col 
      "
      >
        <div
          className="sm:hidden block bg-[#578E7E] text-white
        absolute top-0 left-0 w-full
        "
        >
          <p className="flex justify-center items-center text-xl p-4">
            아이디 찾기
          </p>
        </div>

        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 text-gray-500 hidden sm:block"
        >
          <Image src="/icons/close.svg" alt="close" width={24} height={24} />
        </button>
        <button
          onClick={handleComplete}
          className="absolute top-5 left-4 text-gray-500 sm:hidden block"
        >
          <Image src="/icons/back.svg" alt="close" width={24} height={24} />
        </button>

        <div className="sm:px-0 px-6 mt-20">
          <div>
            {step === 1 && (
              <div className="mb-10">
                <p className="text-xl sm:text-2xl font-bold hidden sm:block">
                  아이디 찾기
                </p>
                <p className="logo sm:hidden block text-2xl">CAMKEEP</p>
                <p className="sm:text-sm text-base sm:font-normal font-bold">
                  가입정보를 입력해 주세요.
                </p>
              </div>
            )}
            {step === 2 && (
              <div className="sm:mb-0 mb-10">
                <p className="text-xl sm:text-2xl font-bold hidden sm:block">
                  아이디 찾기
                </p>
                <p className="logo sm:hidden block text-2xl">CAMKEEP</p>
                <p className="sm:text-sm text-base sm:font-normal font-bold">
                  가입정보를 입력해 주세요.
                </p>
                <p>거의 완료 되었어요!</p>
              </div>
            )}
          </div>
        </div>

        <div className="sm:mt-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                className="mb-20 sm:px-0 px-12 sm:mt-0 mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onAnimationComplete={() => {
                  if (nameRef.current) {
                    nameRef.current.focus();
                    nameRef.current.select();
                  }
                }}
              >
                <Input
                  ref={nameRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력해 주세요"
                  className="placeholder:text-[#875A2C] text-sm p-3 "
                />
                {error && (
                  <p className="text-red-500 text-sm pt-1 pl-1">{error}</p>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                className="sm:mb-4 mb-20 sm:px-0 px-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onAnimationComplete={() => {
                  if (phoneRef.current) {
                    phoneRef.current.focus();
                    phoneRef.current.select();
                  }
                }}
              >
                <div className="my-2 py-1 text-sm text-[#875A2C] bg-[#F5F0E6] rounded-full px-4 inline-block">
                  {name}
                </div>
                <Input
                  ref={phoneRef}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="전화번호 (하이픈 없이)"
                  className="placeholder:text-[#875A2C] text-sm p-3 w-full"
                />
                {error && <p className="text-red-500 text-sm pt-1">{error}</p>}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-col flex justify-center items-center sm:mb-1 mb-10 sm:mt-0 mt-20"
              >
                <div className="flex justify-center ">
                  <Image
                    src="/icons/check-auth.svg"
                    alt="check"
                    width={80}
                    height={80}
                  />
                </div>
                <p className="py-4 text-sm sm:text-base">회원님의 이메일은</p>
                <div className="flex justify-center items-center">
                  <p className="font-semibold text-xl">{email}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(email);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    }}
                    className="text-xs underline ml-1"
                  >
                    <Image
                      src={copied ? "/icons/check-auth.svg" : "/icons/copy.svg"}
                      alt={copied ? "복사 완료" : "복사"}
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="sm:absolute bottom-6 left-0 w-full flex justify-center">
          <button
            onClick={
              step === 1
                ? handleNameSubmit
                : step === 2
                ? handlePhoneSubmit
                : handleComplete
            }
            className="px-24 bg-[#578E7E] text-white font-semibold py-3 rounded text-base"
          >
            {step === 1 ? "다음" : step === 2 ? "완료" : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}
