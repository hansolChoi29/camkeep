// src/components/SplashScreen.tsx
"use client";

export default function SplashScreen() {
  return (
    <div
      className="
        fixed inset-0     /* 화면 전체를 덮음 */
        w-full h-full     /* 가로/세로 100% */
        flex items-center justify-center
        bg-white          /* 배경색 흰색 */
        z-50              /* 최상위 레이어 */
      "
    >
      {/* 여기에 로고나 애니메이션을 넣을 수 있어요 */}
      <div className="logo flex flex-col bg-[#FFAB5B] justify-center items-center  w-full h-full">
        <p className="text-[12px]">캠핑할때 뭐가 필요하지?</p>
        <h1 className="text-[48px]">CAMKEEP</h1>
      </div>
    </div>
  );
}
