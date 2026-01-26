
"use client";

import { GithubSignInButton } from "@/components/auth/github-sign-in-button";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Sign in to Prism</h1>
          <p className="text-sm text-muted-foreground">
            Use your GitHub account to continue
          </p>
        </div>

        {/* Card */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <GithubSignInButton redirect={redirect} />

          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
