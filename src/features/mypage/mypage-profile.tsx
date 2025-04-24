"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

export interface MypageProfileProps {
  photoUrl: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;

  editing: boolean;
  initialNickname: string;
  newNickname: string;
  setNewNickname: Dispatch<SetStateAction<string>>;
  saveNickname: () => Promise<void>;
  cancelEditing: () => void;
  saving: boolean;

  email: string;
  phone: string;
  points: number;
}

export default function MypageProfile(props: MypageProfileProps) {
  const {
    photoUrl,
    handleFileChange,
    uploading,

    editing,
    initialNickname,
    newNickname,
    setNewNickname,
    saveNickname,
    cancelEditing,
    saving,

    email,
    phone,
    points,
  } = props;
  return (
    <>
      <div>
        <div className="relative inline-block">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt="프로필"
              width={100}
              height={100}
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 border rounded-full flex items-center justify-center">
              No Image
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            수정
          </label>

          {uploading && <p className="text-sm">업로드 중…</p>}
        </div>
        {/* 닉네임 수정 */}
        <div className="mt-4 flex items-center space-x-2">
          {editing ? (
            <>
              <Input
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
                onClick={cancelEditing}
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
                onClick={cancelEditing}
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
      </div>
    </>
  );
}
