import React from "react";

export const metadata = {
  title: "Camkeep · Auth",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col px-0  w-screen   bg-[#578E7E]  items-center justify-center ">
      {children}
    </div>
  );
}
