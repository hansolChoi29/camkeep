import { notFound } from "next/navigation";
import AuthClient from "./_components/auth.client";

interface Props {
  params: { mode: string };
}

export default function AuthPage({ params: { mode } }: Props) {
  if (mode !== "login" && mode !== "register") return notFound();
  return <AuthClient mode={mode} />;
}
