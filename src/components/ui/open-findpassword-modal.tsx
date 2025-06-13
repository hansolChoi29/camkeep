"use client";

import Image from "next/image";
import { useEffect } from "react";

interface ModalProps {
  findPasswordOpen: boolean;
  onClose: () => void;
}
export default function OpanFindPasswordModal({
  findPasswordOpen,
  onClose,
}: ModalProps) {
  useEffect(() => {
    if (findPasswordOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auth";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [findPasswordOpen]);

  if (!findPasswordOpen) return null;

  return (
    <div>
      <button onClick={onClose}>
        {" "}
        <Image src="/icons/close.svg" alt="close" width={28} height={28} />
      </button>
    </div>
  );
}
