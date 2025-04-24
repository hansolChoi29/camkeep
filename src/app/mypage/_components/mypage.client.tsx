"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Image from "next/image";

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
      {/* 프로필 사진 */}
      <div>
        <div className="flex  items-center">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt="프로필"
              width={100}
              height={100}
              className="w-32 h-32 rounded-full"
            />
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
        {/* 기본 정보 */}
        <p className="mt-4">이메일: {email}</p>
        <p>전화번호: {phone}</p>
        <p>포인트: {points}</p>

        {/* 닉네임 수정 */}
      </div>

      <hr className="w-full border-t-1 border-[#578E7E] my-4" />

      <div className="w-auto gap-2 mt-6 flex flex-col justify-between">
        <button
          onClick={() => router.push(callback)}
          className="px-4 py-2 border rounded"
        >
          Go Back
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-[#7A73D1] text-white  rounded"
        >
          로그아웃
        </button>
        <button className="bg-[#7A73D1] rounded  text-white">회원탈퇴</button>
      </div>
    </section>
  );
}
