"use client";

import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MenuIcon() {
  const { isLoggedIn } = useAuthStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="z-50 sm:hidden text-3xl p-2 "
        aria-label="메뉴 열기"
      >
        ☰
      </button>

      {open && (
        <div>
          <div
            className="fixed inset-0 z-40 bg-black/70 sm:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            className="
              fixed inset-0 z-50 sm:hidden
              bg-[#578E7E] text-[#FFFAEC] p-6
              flex flex-col
            "
          >
            <button
              onClick={() => setOpen(false)}
              className="self-start text-2xl mb-8"
              aria-label="메뉴 닫기"
            >
              <Image src="/icons/back.svg" alt="back" width={20} height={20} />
            </button>

            <nav className="flex-1  flex flex-col justify-start space-y-6 text-lg">
              <Link href="/camping" onClick={() => setOpen(false)}>
                캠핑장
              </Link>
              <Link href="/equipment-list" onClick={() => setOpen(false)}>
                용품샵
              </Link>
              <Link href="/community" onClick={() => setOpen(false)}>
                커뮤니티
              </Link>
              <Link href="/check-list" onClick={() => setOpen(false)}>
                체크리스트
              </Link>
              {isLoggedIn ? (
                <Link href="/mypage" onClick={() => setOpen(false)}>
                  마이페이지
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setOpen(false)}>
                    로그인
                  </Link>
                  <Link href="/auth/register" onClick={() => setOpen(false)}>
                    회원가입
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
