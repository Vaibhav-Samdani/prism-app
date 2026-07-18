// src/auth/hooks/use-auth.ts
import { useAuthStore } from "../store/use-auth-store";

export function useAuth() {
  const { user, isAuthenticated } = useAuthStore();

  return {
    user,
    isAuthenticated,
  };
}
