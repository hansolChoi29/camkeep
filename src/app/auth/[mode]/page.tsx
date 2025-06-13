import { notFound } from "next/navigation";
import { loginAction, registerAction } from "./actions";
import AuthClient from "../components/auth.client";

export default function AuthPage({
  params: { mode },
}: {
  params: { mode: string };
}) {
  if (mode !== "login" && mode !== "register") return notFound();

  const action = mode === "login" ? loginAction : registerAction;

  return (
    <form action={action} method="post" noValidate className="…">
      <AuthClient mode={mode as "login" | "register"} />
    </form>
  );
}
