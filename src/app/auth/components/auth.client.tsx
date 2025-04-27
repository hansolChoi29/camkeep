"use client";

import AuthFormUI from "@/features/auth/auth-form-ui";

export default function AuthClient({ mode }: { mode: "login" | "register" }) {
  return <AuthFormUI mode={mode} />;
}
