"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import MypageProfile from "@/features/mypage/mypage-profile";
import MypageCart from "@/features/mypage/mypage-cart";
import MypageCommu from "@/features/mypage/mypage-commu";
import MypageComment from "@/features/mypage/mypage-comment";
import MypageCoupon from "@/features/mypage/mypage-coupon";

interface MypageClientProps {
  email: string;
  userId: string;
  nickname: string;
  phone: string;
  points: number;
  photo: string | null;
}

export default function MypageClient({
  email,
  userId,
  nickname: initialNickname,
  phone,
  points,
  photo: initialPhoto,
}: MypageClientProps) {
  const router = useRouter();
  const params = useSearchParams();
  const clearSession = useAuthStore((s) => s.clearSession);
  // 닉네임 수정 상태
  const [editing, setEditing] = useState(false);
  const [newNickname, setNewNickname] = useState(initialNickname);
  const [saving, setSaving] = useState(false);

  // 사진 업로드 상태
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhoto);
  const [uploading, setUploading] = useState(false);

  const callback = params.get("callbackUrl") ?? "/";

  const supabase = useSupabaseClient();
  // 로그아웃
  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) {
      clearSession();
      alert("성공적으로 로그아웃되었습니다.");
      router.push("/auth/login");
    } else {
      const { error } = await res.json();
      console.error("Logout error:", error);
    }
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
    console.log("userId", userId);
    if (error) {
      alert("닉네임 업데이트 실패: " + error.message);
    } else {
      setEditing(false);
    }
  };

  console.log("userId", userId);
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
      console.log("🛠 POST status:", res.status);

      const json = await res.json();

      console.log("🛠 응답 JSON:", json);

      if (!res.ok) throw new Error(json.error);

      // 성공하면 화면 갱신
      setPhotoUrl(json.publicUrl);
      alert("성공적으로 변경되었습니다.");

      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      alert("업로드 실패: " + message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="flex main flex-col items-center justify-center w-full max-w-md p-6 min-h-screen mx-auto">
      <MypageProfile
        photoUrl={photoUrl}
        handleFileChange={handleFileChange}
        uploading={uploading}
        editing={editing}
        initialNickname={initialNickname}
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
        <h1>장바구니</h1>
        <MypageCart />
      </div>

      <div>
        <h1>내가 작성한 커뮤</h1>
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
  );
}
