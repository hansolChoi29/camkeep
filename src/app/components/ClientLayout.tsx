"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SplashScreen from "./SplashScreen";
import Header from "@/widgets/Header";
import GNB from "@/features/GNB/GNB";
import { useAuthStore } from "@/store/useAuthStore";
import CommunityModal from "@/features/community/community-modal";
import CommunityNewPostForm from "@/features/community/community-newpost-form";
import { createClient } from "@/lib/supabase/client";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);
  const pathname = usePathname();
  const supabase = createClient();
  // Splash & Auth 복원
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) =>
      setSession(session)
    );
    return () => listener.subscription.unsubscribe();
  }, [setSession]);

  if (loading) return <SplashScreen />;
  if (["/auth/login", "/auth/register"].includes(pathname)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#578E7E]">
        {children}
      </main>
    );
  }

  const handleNewPost = async (title: string, content: string) => {
    setSubmitting(true);
    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      setModalOpen(false);
      window.location.reload();
    } else {
      console.error((await res.json()).error);
    }
    setSubmitting(false);
  };

  return (
    <>
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <GNB onCommunityClick={() => setModalOpen(true)} />
      {modalOpen && (
        <CommunityModal open={modalOpen} onClose={() => setModalOpen(false)}>
          <CommunityNewPostForm onSubmit={handleNewPost} loading={submitting} />
        </CommunityModal>
      )}
    </>
  );
}
