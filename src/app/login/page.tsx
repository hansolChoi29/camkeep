import React from "react";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex font-sans">
      {/* 이 안의 텍스트는 system‑ui, sans‑serif → 글로벌 폰트 덮어쓰기 */}
      <form className="w-full max-w-sm">
        <h1>로그인</h1>
        <p>회원정보를 입력해 주세요</p>
      </form>
    </main>
  );
}
