"use client";
import Image from "next/image";

interface GoogleProps {
  onClick: () => Promise<void>;
}

export default function Google({ onClick }: GoogleProps) {
  return (
    <>
      <button onClick={onClick}>
        <Image src="/icons/google.svg" alt="google" width={48} height={48} />
      </button>
    </>
  );
}
