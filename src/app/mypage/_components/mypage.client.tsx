// src/app/mypage/_components/mypage.client.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/useAuthStore";

interface MypageClientProps {
  email: string;
  nickname: string;
  phone: string;
  userId: string;
}

export default function MypageClient({
  email,
  userId,
  nickname: initialNickname,
  phone,
}: MypageClientProps) {
  const router = useRouter();
  const params = useSearchParams();
  const clearSession = useAuthStore((s) => s.clearSession);
  console.log("userId", userId);
  // 로컬 상태로 nickname 관리
  const [nickname, setNickname] = useState(initialNickname);
  const [editing, setEditing] = useState(false);
  const [newNickname, setNewNickname] = useState(initialNickname);
  const [saving, setSaving] = useState(false);

  const callback = params.get("callbackUrl") ?? "/";

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      clearSession();
      router.push("/auth/login");
    }
  };

  const startEdit = () => {
    setNewNickname(nickname);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setNewNickname(nickname);
  };

  const saveNickname = async () => {
    if (!userId) {
      alert("사용자 정보가 없습니다.");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("users")
      .update({ nickname: newNickname })
      .eq("id", userId)
      .single();
    setSaving(false);

    if (error) {
      alert("닉네임 업데이트 실패: " + error.message);
    } else {
      setNickname(newNickname);
      setEditing(false);
    }
  };

  return (
    <section className="w-full sm:max-w-[560px] mx-auto flex flex-col items-center">
      <h2 className="mt-[144px] text-[20px]">Welcome, {email}</h2>
      <p className="mt-4">전화번호: {phone}</p>

      <div className="mt-4 flex items-center space-x-2">
        {editing ? (
          <>
            <input
              type="text"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="border p-1 rounded"
              disabled={saving}
            />
            <button onClick={saveNickname} disabled={saving}>
              {saving ? "저장 중…" : "저장"}
            </button>
            <button onClick={cancelEdit} disabled={saving}>
              취소
            </button>
          </>
        ) : (
          <>
            <p>닉네임: {nickname}</p>
            <button onClick={startEdit}>수정</button>
          </>
        )}
      </div>

      <div className="mt-8 flex space-x-4">
        <button onClick={() => router.push(callback)}>Go back</button>
        <button onClick={handleLogout}>로그아웃</button>
      </div>
    </section>
  );
}
