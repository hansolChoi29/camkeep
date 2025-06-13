"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ModalProps {
  findPasswordOpen: boolean;
  onClose: () => void;
}
export default function OpanFindPasswordModal({
  findPasswordOpen,
  onClose,
}: ModalProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (findPasswordOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auth";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [findPasswordOpen]);

  const findPassword = async () => {
    setError("");
    if (!email || !phone) {
      setError("모두 입력해 주세요.");
      return;
      }
      
      try {
          const res = await fetch('/api/auth/find-password', {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ email, phone }),
          });
          const data = await res.json();

          if (!res.ok) {
              setError(data.error || '이메일을 찾을 수 없습니다.')
              return;
          }

          setEmail(data.email);
          setStep(2);
      }
  };

  const handleComplete = () => {
    setStep(1);
    setPhone("");
    setEmail("");
    setError("");
    onClose();
  };

  if (!findPasswordOpen) return null;
  return (
    <div className="fixed inset-0 text-[#578E7E] bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#FFFAEC] rounded-xl shadow-lg w-full max-w-lg  p-6 relative ">
        <div className="my-10">
          <button
            onClick={handleComplete}
            className="absolute top-2 right-2 text-gray-500 mt-4 mr-4"
          >
            <Image src="/icons/close.svg" alt="close" width={28} height={28} />
          </button>
        </div>

        {step === 1 && (
          <>
            <h1 className="text-center text-3xl font-bold   logo">CAMKEEP</h1>
            <p className="text-center  font-bold   logo">아이디 찾기</p>
            <div>
              <p>이메일</p>
              <input
                placeholder="이메일을 입력해 주세요"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                value={email}
              />
            </div>
            <div>
              <p>휴대폰 번호</p>
              <input
                placeholder="휴대폰 번호를 입력해 주세요"
                onChange={(e) => setPhone(e.target.value)}
                type="text"
                value={phone}
              />
            </div>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <div className="flex justify-center mt-10">
              <button
                onClick={findPassword}
                className="bg-[#578E7E] text-white font-bold rounded py-2 px-20"
              >
                완료
              </button>
            </div>
          </>
        )}
        {step === 2 && <>둘</>}
        {step === 3 && <>셋</>}
      </div>
    </div>
  );
}
