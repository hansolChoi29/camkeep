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
    <div className="  w-screen h-screen  bg-[#FFAB5B] flex items-center justify-center ">
      {children}
    </div>
  );
}
