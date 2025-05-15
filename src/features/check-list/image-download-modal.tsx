"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";

export interface ImageDownloadModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function ImageDownloadModal({
  open,
  onClose,
  onConfirm,
}: ImageDownloadModalProps) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <h2 className="text-lg font-semibold mb-2">이미지 다운로드</h2>
          <p className="text-sm text-gray-600 mb-4">
            현재 화면의 체크리스트를 이미지로 저장합니다. 계속하시겠습니까?
            만약, 체크박스가 표시되어 있으면 이미지가 깨질 수 있습니다.
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button
              onClick={async () => {
                await onConfirm();
                onClose();
              }}
            >
              다운로드
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
