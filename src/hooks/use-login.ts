// src/auth/hooks/use-login.ts
"use client";

import { signIn } from "@/lib/auth-client";

export function useLogin() {
  const login =  async (redirect?: string) => {
    await signIn.social({
      provider: "github",
      callbackURL: redirect || "/",
    });
  };


  return login
}
