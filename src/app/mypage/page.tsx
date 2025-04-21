"use client";
// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useSession } from "next-auth/react";

export default function MyPage() {
  //   const { data: session, status } = useSession();
  //   const router = useRouter();
  //   const params = useSearchParams();
  //   const callbackUrl = params.get("callbackUrl") || "/";

  //   useEffect(() => {
  //     if (status === "unauthenticated") {
  //       router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  //     }
  //   }, [status, callbackUrl, router]);

  //   if (status === "loading" || status === "unauthenticated") {
  //     return <div>Loading…</div>;
  //   }
  //   if (!session) {
  //     router.push("/login");
  //     return null;
  //   }
  return (
    <section className="w-full sm:max-w-[560px] mx-auto ">
      <h2 className="mt-[144px] text-[20px]">
        Welcome
        {/* {session.user?.name} */}
      </h2>
    </section>
  );
}
