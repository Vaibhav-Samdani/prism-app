// src/auth/hooks/use-logout.ts
"use client";

import { signOut } from "@/lib/auth-client";
import { useAuthStore } from "../store/use-auth-store";

export function useLogout() {
  const clearUser = useAuthStore((s) => s.clearUser);

  return async () => {
    await signOut();
    clearUser();
  };
}
