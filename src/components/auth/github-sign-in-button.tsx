"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useAuthSession } from "@/hooks/use-auth-session";
import { useLogin } from "@/hooks/use-login";
import { useLogout } from "@/hooks/use-logout";
import { LogOut } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export function GithubSignInButton({ redirect }: { redirect?: string }) {
  const { isLoading } = useAuthSession();
  const { isAuthenticated } = useAuth();
  const login = useLogin();
  const logout = useLogout();

  if (isLoading) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  if (isAuthenticated) {
    return (
      <Button
        variant="outline"
        className="w-full h-11 flex items-center gap-3"
        onClick={logout}
      >
        <LogOut className="text-xl" />
        Log out with GitHub
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className="w-full h-11 flex items-center gap-3"
      onClick={() => login(redirect)}
    >
      <FaGithub className="text-xl" />
      Continue with GitHub
    </Button>
  );
}
