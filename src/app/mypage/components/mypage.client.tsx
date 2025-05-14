"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import MypageProfile from "@/features/mypage/mypage-profile";
import MypageCart from "@/features/mypage/mypage-cart";
import MypageCommu from "@/features/mypage/mypage-commu";
import MypageComment from "@/features/mypage/mypage-comment";
import MypageCoupon from "@/features/mypage/mypage-coupon";
import { SimpleToast } from "@/components/SimpleToast";
import { browserSupabase } from "@/lib/supabase/client";
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
  const supabase = browserSupabase();
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
    <>
      <section className="flex main flex-col items-center justify-center w-full max-w-md p-6 min-h-screen mx-auto">
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
          <h1>장바구니dkdk</h1>
          <MypageCart />
        </div>

        <div>
          <h1>내가 작성한 커뮤dpdpd엥ㅇ?????</h1>
          <MypageCommu />
        </div>

        <div>
          <h1>내가 작성한 뎃글</h1>
          <MypageComment />
        </div>

        <div>
          <h1>내 쿠폰</h1>
          <MypageCoupon />
        </div>

        <div className="w-auto gap-2 mt-6 flex flex-col justify-between">
          <button
            onClick={() => router.push(callback)}
            className="px-4 py-2 border rounded"
          >
            Go Back
          </button>

          <button className="px-4 py-2 w-96 bg-[#578E7E] rounded  text-white transform transition-transform duration-200 ease-in-out hover:scale-110">
            회원탈퇴
          </button>
        </div>
      </section>

      {toastMsg && (
        <SimpleToast
          message={toastMsg}
          duration={2000}
          onClose={() => setToastMsg(null)}
        />
      )}
    </>
  );
}
