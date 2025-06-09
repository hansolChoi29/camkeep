"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { logout as logoutAction } from "@/app/auth/[mode]/actions";
import { createClient } from "@/lib/supabase/client";
import type { UserProfile } from "@/types/user";
import type { Session } from "@supabase/supabase-js";

export default function LoginButton() {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // 페이지 로드 시 “이미 남아 있는 세션” 불러오기 + onAuthStateChange 구독
  useEffect(() => {
    // 초기 세션 복원: Supabase가 로컬 스토리지나 쿠키에 남긴 토큰을 가져옴
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);

      // 로그인된 유저가 있으면, users 테이블에서 프로필을 조회
      if (data.session?.user) {
        const u = data.session.user;
        // 여기서 u.email은 string | undefined 이므로, 그대로 쓰면 타입 에러.
        // 하지만 로그인 시점에 Supabase에 이메일을 정확히 저장했으면 undefined가 아닐 테니
        // non-null assertion(!)을 사용하거나, || "" 같은 표현으로 기본값 처리 가능
        fetchUserProfile(u.id, u.email || "");
      }
    });

    //이후 세션 변화(로그인/로그아웃/토큰 갱신 등)를 구독
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);

        if (newSession?.user) {
          const u = newSession.user;
          fetchUserProfile(u.id, u.email || "");
        } else {
          setUserProfile(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  //  users 테이블에서 id를 기준으로 nickname & profile URL을 조회하는 함수
  async function fetchUserProfile(userId: string, email: string) {
    try {
      // 조회 도중 스켈레톤 UI를 위해 userProfile을 null로 유지하거나 초기화
      setUserProfile(null);

      const { data, error } = await supabase
        .from("users")
        .select("nickname, profile, email")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("프로필 조회 실패:", error.message);
        // 조회에 실패하면 이메일 앞부분을 name으로, avatarUrl은 undefined
        setUserProfile({
          id: userId,
          name: email.split("@")[0],
          email,
          avatarUrl: undefined,
        });
      } else {
        setUserProfile({
          id: userId,
          name: data.nickname,
          email,
          avatarUrl: data.profile ?? undefined, // users.profile 컬럼이 이미지 URL이라고 가정
        });
      }
    } catch (err) {
      console.error("프로필 조회 중 예외:", err);
      setUserProfile({
        id: userId,
        name: email.split("@")[0],
        email,
        avatarUrl: undefined,
      });
    }
  }

  // 로그아웃 핸들러: 서버 액션 호출 후 home으로 리다이렉트
  const handleLogout = async () => {
    try {
      // 서버 액션으로 Supabase 세션 파기 + 쿠키 만료
      await logoutAction();
      // 클라이언트에도 local state 초기화
      setSession(null);
      setUserProfile(null);
      // 홈 페이지로 새로고침
      window.location.replace("/");
    } catch (e) {
      console.error("로그아웃 중 오류:", e);
    }
  };

  //  UI: “로그인되지 않은 상태” vs “로그인된 상태” 분기
  if (!session) {
    // ■ 로그인 전
    return (
      <div className="border h-36 mt-10 rounded-xl sm:px-4 flex justify-center items-center gowun">
        <div className="flex flex-col justify-center items-center">
          <p>더 안전하고 편리하게 이용하세요</p>
          <Link
            href="/auth/login"
            className="mt-2 bg-[#578E7E] w-80 justify-center text-white p-2 rounded flex"
          >
            <div className="flex">
              <p className="font-extrabold pr-1">camkeep </p>
              <p> 로그인</p>
            </div>
          </Link>
          <div className="mt-2">
            <Link
              href="/auth/reset-id"
              className="text-xs ml-1 hover:underline"
            >
              아이디찾기
            </Link>
            <span className="mx-1 text-xs">|</span>
            <Link
              href="/auth/reset-password"
              className="text-xs ml-1 hover:underline"
            >
              비밀번호 재설정
            </Link>
            <span className="mx-1 text-xs">|</span>
            <Link href="/auth/register" className="text-xs hover:underline">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ■ 로그인된 상태 sm:w-full w-4/12
  return (
    <div className="border sm:w-80  h-36 mt-10 rounded-xl sm:p-4 flex justify-center items-center gowun ">
      <div className="flex flex-col items-center">
        {/*  프로필 사진 영역 */}
        {userProfile === null ? (
          // 스켈레톤 UI
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
        ) : (
          <div className="w-14 h-14 relative ">
            {userProfile.avatarUrl ? (
              <Image
                src={userProfile.avatarUrl}
                alt="프로필 이미지"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">?</span>
              </div>
            )}
          </div>
        )}

        {/* 닉네임 및 로그아웃 버튼 */}
        <div className="flex flex-col  justify-center items-center gap-1 text-sm">
          <Link
            href="/mypage"
            className=" font-semibold  hover:underline flex w-auto items-center"
          >
            {userProfile === null ? "로딩 중..." : `${userProfile.name}`}
            <p className=" pl-2">
              {userProfile === null ? "로딩 중" : `${userProfile.email}`}
            </p>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="pt-2 text-xs text-[#578E7E] hover:underline "
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
