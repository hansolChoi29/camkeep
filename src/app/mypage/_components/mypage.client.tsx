// src/app/mypage/_components/mypage.client.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/useAuthStore";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

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
    const { error } = await supabase.auth.signOut();
    if (!error) {
      clearSession();
      router.push("/auth/login");
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
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      // 1) 인증된 상태로 storage 업로드
      const ext = file.name.split(".").pop();
      const filePath = `${userId}/avatar.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
      if (upErr) throw upErr;

      // 2) public URL
      const { data: urlData, error: urlErr } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      if (urlErr) throw urlErr;

      // 3) users 테이블 업데이트 (쿠키 세션 포함)
      const res = await fetch("/api/user/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ publicUrl: urlData.publicUrl }),
      });
      if (!res.ok) throw new Error((await res.json()).error);

      // 4) UI 갱신
      // setPhotoUrl(urlData.publicUrl);
    } catch (err) {
      console.error("업로드 실패:", err.message);
      alert("업로드 실패: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="w-full text-[#504B38] sm:max-w-[560px] mx-auto p-4 bg-[#B9B28A] rounded">
      {/* 프로필 사진 */}
      <div className="flex flex-col items-center">
        {photoUrl ? (
          <img src={photoUrl} alt="프로필" className="w-32 h-32 rounded-full" />
        ) : (
          <div className="w-32 h-32 border rounded-full flex items-center justify-center">
            No Image
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="mt-2"
        />
        {uploading && <p className="text-sm">업로드 중…</p>}
      </div>

      {/* 기본 정보 */}
      <p className="mt-4">이메일: {email}</p>
      <p>전화번호: {phone}</p>
      <p>포인트: {points}</p>

      {/* 닉네임 수정 */}
      <div className="mt-4 flex items-center space-x-2">
        {editing ? (
          <>
            <input
              type="text"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              disabled={saving}
              className="border p-1 rounded"
            />
            <button
              onClick={saveNickname}
              disabled={saving}
              className="px-3 py-1   rounded"
            >
              {saving ? "저장 중…" : "저장"}
            </button>
            <button
              onClick={() => setEditing(false)}
              disabled={saving}
              className="px-3 py-1 border rounded"
            >
              취소
            </button>
          </>
        ) : (
          <>
            <p>닉네임: {initialNickname}</p>
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1 border rounded"
            >
              수정
            </button>
          </>
        )}
      </div>

      {/* 뒤로가기·로그아웃 */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => router.push(callback)}
          className="px-4 py-2 border rounded"
        >
          Go Back
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-[#504B38] text-white rounded"
        >
          로그아웃
        </button>
      </div>
    </section>
  );
}
