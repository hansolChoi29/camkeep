// components/LoginButton.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useSupabaseClient,
  useSession,
  useUser,
} from "@supabase/auth-helpers-react";
import { logout as logoutAction } from "@/app/auth/[mode]/actions"; // server-side logout 액션

interface ProfileData {
  nickname: string;
  profile_url: string | null;
}

export default function LoginButton() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const user = useUser();
  console.log("user", user);
  // 서버에 users 테이블이 있고, 거기서 nickname/profile_url 필드를 관리한다고 가정
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // 사용자 정보가 들어오면 users 테이블에서 프로필을 조회
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from("users")
        .select("nickname, profile")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("프로필 조회 실패:", error.message);
        setProfile({
          nickname: user.email!.split("@")[0],
          profile_url: null,
        });
      } else {
        setProfile({
          nickname: data.nickname,
          profile_url: data.profile, // users.profile 컬럼에 저장된 URL
        });
      }
      setLoadingProfile(false);
    };

    fetchProfile();
  }, [user, supabase]);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      // server action으로 signOut & 쿠키 만료, 리다이렉트 처리
      await logoutAction();
      // 페이지 새로고침 혹은 루트 경로로 이동
      window.location.replace("/");
    } catch (e) {
      console.error("로그아웃 중 오류:", e);
    }
  };

  // ─── 로그인 상태가 아닐 때 ────────────────────────
  if (!session) {
    return (
      <div className="border h-36 mt-10 rounded-xl sm:px-4 flex justify-center items-center gowun">
        <div className="flex flex-col justify-center w-full items-center">
          <p>더 안전하고 편리하게 이용하세요</p>
          <Link
            href="/auth/login"
            className="mt-2 bg-[#578E7E] w-80 justify-center text-white p-2 rounded flex"
          >
            <div className="flex">
              <p className="font-extrabold">camkeep</p>
              <p>로그인</p>
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

  // ─── 로그인 상태일 때 ────────────────────────────
  return (
    <div className="border h-36 mt-10 rounded-xl sm:px-4 flex justify-center items-center gowun">
      <div className="flex items-center space-x-4">
        {/* 프로필 사진 */}
        {loadingProfile ? (
          <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
        ) : (
          <div className="w-12 h-12 relative">
            {profile?.profile_url ? (
              <Image
                src={profile.profile_url}
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

        {/* 닉네임과 로그아웃 버튼 */}
        <div className="flex flex-col">
          <p className="text-base font-semibold">
            {loadingProfile
              ? "로딩 중..."
              : `${profile?.nickname}님 환영합니다!`}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 text-xs text-[#578E7E] hover:underline"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
