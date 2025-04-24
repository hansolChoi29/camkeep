"use client";
import AuthForm from "@/features/auth/auth-form";
import { useAuthForm } from "@/features/auth/useAuthForm";

export default function AuthClient({ mode }: { mode: "login" | "register" }) {
  const { form, setters, state, handleSubmit } = useAuthForm(mode);
  return (
    <AuthForm
      mode={mode}
      form={form}
      setters={setters}
      state={state}
      handleSubmit={handleSubmit}
    />
  );
}
