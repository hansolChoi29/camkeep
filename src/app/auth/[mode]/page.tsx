import { notFound } from "next/navigation";
import { loginAction, registerAction } from "./actions";
import AuthClient from "../components/auth.client";
import ResetPasswordClient from "../components/reset-password.client";
import FindIdClient from "../components/find-id.client";

export default function AuthPage({
  params: { mode },
}: {
  params: { mode: string };
}) {
  if (mode === "reset-password") return <ResetPasswordClient />;
  if (mode === "find-id") return <FindIdClient />;

  if (mode !== "login" && mode !== "register") return notFound();

  const action = mode === "login" ? loginAction : registerAction;

  return (
    <form action={action} method="post" className="…">
      <AuthClient mode={mode} />
    </form>
  );
}
