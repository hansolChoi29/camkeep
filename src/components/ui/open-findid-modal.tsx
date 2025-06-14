"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ModalProps {
  findIdOpen: boolean;
  onClose: () => void;
}

export default function OpenFindidModal({ findIdOpen, onClose }: ModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (findIdOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [findIdOpen]);

  const findEmail = async () => {
    setError("");
    if (!name || !phone) {
      setError("모두 입력해 주세요.");
      return;
    }

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
      setStep(2);
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
    onClose();
  };

  if (!findIdOpen) return null;

  return (
    <div
      tabIndex={-1}
      onKeyDownCapture={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          findEmail();
        }
      }}
      className="bg-transparent fixed inset-0 text-[#578E7E] bg-black bg-opacity-50 flex justify-center items-center z-50 "
    >
      <div
        className="bg-[#FFFAEC] shadow-lg
          w-full h-full 
          rounded-none
          sm:rounded-xl sm:w-full sm:max-w-lg sm:h-auto 
          relative"
      >
        <div
          className=" w-full bg-[#FFFAEC] border-b border-gray-200 
                        block sm:hidden text-center "
        >
          <h2 className="text-lg font-bold bg-[#578E7E] text-white p-6">
            아이디 찾기
          </h2>
        </div>
        <button
          onClick={handleComplete}
          className="absolute top-2 right-2 text-gray-500 mt-4 mr-4"
        >
          <Image src="/icons/close.svg" alt="close" width={28} height={28} />
        </button>

        <div className="sm:p-6 p-12">
          {step === 1 && (
            <>
              {" "}
              <div className="logo text-xl pt-4 ">
                <p className="sm:text-3xl text-xl">CAMKEEP </p>
                <p className="pb-12 sm:text-xl text-base">
                  가입정보를 입력해 주세요.
                </p>
              </div>
              <div className=" text-[#875A2C]">
                <p className="font-bold pb-1">이름</p>
                <input
                  value={name}
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded  w-full p-2 placeholder:text-[#875A2C] focus:outline-none focus:border-[#875A2C]"
                  placeholder="이름을 입력해 주세요."
                  type="text"
                />
              </div>
              <div className=" text-[#875A2C] mt-8">
                <p className="font-bold pb-1">휴대폰번호</p>
                <input
                  value={phone}
                  name="phone"
                  onChange={(e) => setPhone(e.target.value)}
                  className="border rounded w-full p-2  placeholder:text-[#875A2C] focus:outline-none focus:border-[#875A2C]"
                  placeholder="휴대폰 번호를 입력해 주세요."
                  type="text"
                />
              </div>
              {error && <p className="text-red-500 my-2 ">{error}</p>}
              <div className="flex justify-center sm:mt-16 mt-28">
                <button
                  onClick={findEmail}
                  type="button"
                  className="bg-[#578E7E] text-white font-bold rounded py-2 px-20 sm:text-base text-sm"
                >
                  완료
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="text-center flex flex-col gap-1">
              <div className="flex justify-center mt-10">
                <Image
                  src="/icons/check-auth.svg"
                  alt="체크 아이콘"
                  width={80}
                  height={80}
                />
              </div>
              <p className="sm:text-xl text-sm">회원님의 이메일은</p>
              <div className="flex items-center justify-center gap-2">
                <p className="font-semibold sm:text-xl text-sm">{email}</p>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(email);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1800); // 5초 후 복사 아이콘으로 복귀
                  }}
                  className="p-1 rounded hover:bg-gray-200"
                  aria-label="이메일 복사"
                >
                  <Image
                    src={copied ? "/icons/check-auth.svg" : "/icons/copy.svg"}
                    alt={copied ? "복사 완료" : "복사 아이콘"}
                    width={20}
                    height={20}
                  />
                </button>
              </div>
              <p className="mb-4 sm:text-xl text-sm">다시 로그인 해주세요.</p>
              <div className="flex justify-center sm:mt-16 mt-36">
                <button
                  onClick={handleComplete}
                  type="button"
                  className="bg-[#578E7E] text-white font-bold rounded py-2 px-20 sm:text-base text-sm"
                >
                  확인
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
