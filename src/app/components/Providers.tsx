"use client";
import { Session, SessionContextProvider } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

const queryClient = new QueryClient();

export function Providers({
  initialSession,
  children,
}: {
  initialSession: Session | null;
  children: React.ReactNode;
}) {
  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={initialSession}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionContextProvider>
  );
}
