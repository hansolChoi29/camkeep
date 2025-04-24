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

  handleLogout: () => void;
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
    handleLogout,
    email,
    phone,
    points,
  } = props;
  return (
    <div className="flex items-start w-full">
      <div className="relative flex-shrink-0">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt="프로필"
            width={128}
            height={128}
            className="w-32 h-32 rounded-full object-cover"
          />
        ) : (
          <div className="w-32 h-32 border rounded-full flex items-center justify-center">
            No Image
          </div>
        )}
        <label className="absolute bottom-0 right-1 bg-white p-2 rounded-full shadow cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          <img src="/images/update.png" width={30} height={30} />
        </label>
        {uploading && <p className="mt-2 text-sm text-gray-500">업로드 중…</p>}
      </div>

      <div className="flex-1 ml-6 flex flex-col space-y-4">
        <div className="flex items-center">
          {editing ? (
            <>
              <input
                type="text"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                disabled={saving}
                className="border p-1 rounded flex-1"
              />
              <button
                onClick={saveNickname}
                disabled={saving}
                className="px-3 py-1 bg-[#578E7E] text-white rounded ml-2"
              >
                {saving ? "저장 중…" : "저장"}
              </button>
              <button
                onClick={cancelEditing}
                disabled={saving}
                className="px-3 py-1 border rounded ml-2"
              >
                취소
              </button>
            </>
          ) : (
            <div className="flex justify-center items-center">
              <p className="text-lg font-medium mr-2">
                닉네임: {initialNickname}
              </p>
              <button
                onClick={cancelEditing}
                className=" border rounded border-none"
              >
                <img src="/images/update.png" width={25} height={25} />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center space-x-6">
          <p>이메일: {email}</p>
          <p>전화번호: {phone}</p>
          <p>포인트: {points}</p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#578E7E]  text-white rounded transform transition-transform duration-200 ease-in-out hover:scale-110"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
