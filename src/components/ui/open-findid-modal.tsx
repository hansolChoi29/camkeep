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

  useEffect(() => {
    if (findIdOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [findIdOpen]);

  useEffect(() => {
    if (step === 2 && phoneRef.current) phoneRef.current.focus();
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
      className="bg-black bg-opacity-50 fixed inset-0 text-[#578E7E] flex justify-center items-center z-50 bg-transparent "
      onKeyDownCapture={(e) => {
        if (e.key === "Enter") {
          if (step === 1) handleNameSubmit();
          if (step === 2) handlePhoneSubmit();
        }
      }}
    >
      <div
        className="bg-[#FFFAEC] text-[#578E7E]  shadow-lg w-full h-full  max-w-lg  sm:w-full sm:max-w-lg sm:h-auto rounded-none p-6
          sm:rounded-xl
          relative"
      >
        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 text-gray-500"
        >
          <Image src="/icons/close.svg" alt="close" width={24} height={24} />
        </button>

        <div className="text-xl sm:text-2xl font-bold mb-6 text-center">
          CAMKEEP
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력해 주세요"
                className="placeholder:text-[#875A2C] text-sm p-3"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={handleNameSubmit}
                className="w-full bg-[#578E7E] text-white font-semibold py-2 rounded"
              >
                다음
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-sm text-[#875A2C] bg-[#F5F0E6] rounded-full px-4 py-1 inline-block">
                {name}
              </div>
              <Input
                ref={phoneRef}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="전화번호 (하이픈 없이)"
                className="placeholder:text-[#875A2C] text-sm p-3"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={handlePhoneSubmit}
                className="w-full bg-[#578E7E] text-white font-semibold py-2 rounded"
              >
                완료
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center">
                <Image
                  src="/icons/check-auth.svg"
                  alt="check"
                  width={70}
                  height={70}
                />
              </div>
              <p className="text-[#875A2C] text-sm sm:text-base">
                회원님의 이메일은 <br />
                <span className="font-semibold text-[#578E7E]">{email}</span>
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(email);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="text-xs text-[#578E7E] underline"
              >
                {copied ? "복사 완료!" : "이메일 복사하기"}
              </button>
              <button
                onClick={handleComplete}
                className="w-full bg-[#578E7E] text-white font-semibold py-2 rounded"
              >
                확인
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
