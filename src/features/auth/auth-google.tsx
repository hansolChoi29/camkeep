"use client";
import Image from "next/image";

interface GoogleProps {
  onClick: () => Promise<vide>;
}

export default function Google({ onClick }: GoogleProps) {
  return (
    <>
      <button onClick={onClick}>
        <Image src="/images/google.svg" alt="google" width={40} height={40} />
      </button>
    </>
  );
}
