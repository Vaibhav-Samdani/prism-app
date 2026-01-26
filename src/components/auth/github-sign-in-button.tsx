"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useEffect } from "react";
import { FaGithub } from "react-icons/fa";

export function GithubSignInButton({ redirect }: { redirect?: string }) {
  const { data: session, isPending } = useSession();

  useEffect(() => {
    console.log("---> session : ", session);
  }, []);

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        Loading...
      </div>
    );
  }

  const signOutBtn = async () => {
    await signOut();
  };

  if (session?.user) {
    return (
      <Button
        variant="outline"
        className="w-full h-11 flex items-center justify-center gap-3"
        onClick={signOutBtn}
      >
        <LogOut className="text-xl" />
        Log out with GitHub
      </Button>
    );
  }

  const signInBtn = async () => {
    await signIn.social({
      provider: "github",
      callbackURL: redirect || "/",
    });
  };

  return (
    <Button
      variant="outline"
      className="w-full h-11 flex items-center justify-center gap-3"
      onClick={signInBtn}
    >
      <FaGithub className="text-xl" />
      Continue with GitHub
    </Button>
  );
}
