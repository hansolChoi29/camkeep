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
    <div className="  w-screen h-screen  bg-[#123458] flex items-center justify-center ">
      {children}
    </div>
  );
}
