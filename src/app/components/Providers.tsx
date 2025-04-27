"use client";

import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import type { Session } from "@supabase/supabase-js";

const queryClient = new QueryClient();

interface ProvidersProps {
  initialSession: Session | null;
  children: React.ReactNode;
}

export function Providers({ initialSession, children }: ProvidersProps) {
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    setSession(initialSession);
  }, [initialSession, setSession]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
