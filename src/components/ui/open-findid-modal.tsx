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
      className="bg-black bg-opacity-50 fixed inset-0 text-[#578E7E] flex justify-center items-center z-50 bg-transparent"
      onKeyDownCapture={(e) => {
        if (e.key === "Enter") {
          if (step === 1) handleNameSubmit();
          if (step === 2) handlePhoneSubmit();
        }
      }}
    >
      <div className="bg-[#FFFAEC] text-[#578E7E] shadow-lg w-full max-w-lg h-[420px] sm:h-[460px] sm:rounded-xl rounded-none p-6 relative flex flex-col justify-center">
        <button onClick={handleComplete} className="absolute top-4 right-4">
          <Image src="/icons/close.svg" alt="close" width={24} height={24} />
        </button>

        <div className="mb-6 text-center pb-8">
          {step === 1 && (
            <>
              <p className="text-xl sm:text-2xl font-bold ">아이디 찾기</p>
              <p className="text-sm">가입정보를 확인해 주세요.</p>
            </>
          )}
          {step === 2 && (
            <>
              <p className="text-xl sm:text-2xl font-bold ">아이디 찾기</p>
              <p className="text-sm ">거의 완료 되었습니다.</p>
            </>
          )}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
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
              <div className="my-2 py-1 text-sm text-[#5c5c5c] bg-[#daffd8] rounded-full px-4 inline-block">
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
              className="text-center"
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
                    src={copied ? "/icons/auth-check.svg" : "/icons/copy.svg"}
                    alt={copied ? "복사 완료" : "복사"}
                    width={14}
                    height={14}
                  />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full justify-center flex">
          <button
            onClick={
              step === 1
                ? handleNameSubmit
                : step === 2
                ? handlePhoneSubmit
                : handleComplete
            }
            className="px-24 bg-[#578E7E] mt-20 text-white font-semibold py-3 rounded text-base flex justify-center"
          >
            {step === 1 ? "다음" : step === 2 ? "완료" : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}
