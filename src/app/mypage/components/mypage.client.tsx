"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import MypageProfile from "@/features/mypage/mypage-profile";
import MypageCart from "@/features/mypage/mypage-cart";
import MypageCommu from "@/features/mypage/mypage-commu";
import MypageCoupon from "@/features/mypage/mypage-coupon";
import { SimpleToast } from "@/components/SimpleToast";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/auth/[mode]/actions";

interface PostSummary {
  id: string;
  title: string;
  created_at: string;
}
interface MypageClientProps {
  email: string;
  userId: string;
  nickname: string;
  phone: string;
  points: number;
  photo: string | null;
  initialPosts: PostSummary[];
}
// 커밋주석
export default function MypageClient({
  email,
  userId,
  nickname: initialNicknameProp,
  phone,
  points,
  photo: initialPhoto,
  initialPosts,
}: MypageClientProps) {
  const router = useRouter();
  const params = useSearchParams();
  const clearSession = useAuthStore((s) => s.clearSession);
  // 닉네임 수정 상태
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(initialNicknameProp);
  const [saving, setSaving] = useState(false);
  const [newNickname, setNewNickname] = useState(initialNicknameProp);
  // 사진 업로드 상태
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhoto);
  const [uploading, setUploading] = useState(false);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const callback = params.get("callbackUrl") ?? "/";
  const supabase = createClient();
  // 로그아웃
  const handleLogout = async () => {
    await logout();
    clearSession();
    location.replace("/auth/login");
  };

  // 닉네임 저장
  const saveNickname = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("users")
      .update({ nickname: newNickname })
      .eq("id", userId)
      .single();
    setSaving(false);

    if (error) {
      setToastMsg("닉네임 업데이트 실패: " + error.message);
    } else {
      setNickname(newNickname);

      setEditing(false);
      setToastMsg("닉네임이 성공적으로 변경되었습니다.");
    }
  };

  // 파일 선택 → Storage 업로드 → publicUrl → 서버 API 호출
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("userId", userId);

      const res = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error);

      // 성공하면 화면 갱신
      setPhotoUrl(json.publicUrl);
      setToastMsg("프로필 사진이 성공적으로 변경되었습니다.");

      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setToastMsg("업로드 실패: " + message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section>
      <div className="flex flex-col items-stretch justify-center gowun w-full max-w-4xl  min-h-screen mx-auto">
        <MypageProfile
          photoUrl={photoUrl}
          handleFileChange={handleFileChange}
          uploading={uploading}
          editing={editing}
          initialNickname={nickname}
          newNickname={newNickname}
          setNewNickname={setNewNickname}
          saveNickname={saveNickname}
          cancelEditing={() => setEditing((v) => !v)}
          saving={saving}
          email={email}
          phone={phone}
          points={points}
          handleLogout={handleLogout}
        />

        <hr className="w-full border-t-1 border-[#578E7E] my-4" />

        <div>
          <div className="border-b border-b-1 pb-4 flex justify-center">
            <MypageCart />
          </div>
          <MypageCommu initialPosts={initialPosts} />

          <MypageCoupon />
        </div>
      </div>

      <article className="mt-2 flex flex-col gap-2 items-end logo">
        <button
          onClick={() => router.push(callback)}
          className="bg-[#578E7E] text-white  px-4 py-2 border rounded transform transition-transform duration-200 ease-in-out hover:scale-110 mb-10 "
        >
          뒤로가기
        </button>

        <button className="px-4 py-2  rounded">회원탈퇴</button>
      </article>

      {toastMsg && (
        <SimpleToast
          message={toastMsg}
          duration={2000}
          onClose={() => setToastMsg(null)}
        />
      )}
    </section>
  );
}
