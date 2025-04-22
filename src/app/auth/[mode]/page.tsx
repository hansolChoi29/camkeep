// page.tsx
import { notFound } from "next/navigation";
import AuthClient from "./_components/auth.client";

export default function AuthPage({
  params: { mode },
}: {
  params: { mode: string };
}) {
  if (mode !== "login" && mode !== "register") return notFound();
  return <AuthClient mode={mode as "login" | "register"} />;
}
