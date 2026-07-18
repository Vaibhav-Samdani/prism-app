// src/auth/hooks/use-auth-session.ts
"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useAuthStore } from "../store/use-auth-store";

export function useAuthSession() {
  const { data: session, isPending } = useSession();
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      });
    } else {
      clearUser();
    }
  }, [session, setUser, clearUser]);

  return {
    isLoading: isPending,
  };
}
