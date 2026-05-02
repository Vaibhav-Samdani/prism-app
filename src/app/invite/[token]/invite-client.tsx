"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

export function InviteClient({ invitation, session, token }: any) {
  const router = useRouter();

  const { mutate: acceptInvite, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/invites/accept", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      toast.success("Welcome to the workspace!");
      router.push(`/dashboard`);
      router.refresh();
    },
    onError: (err) => {
      toast.error("Failed to join workspace. Please try again.");
      console.error(err);
    },
  });

  const isWrongUser = session && session.user.email !== invitation.email;

  return (
    <Card className="w-full max-w-md border-primary/10 shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <UserPlus className="text-primary w-6 h-6" />
        </div>
        <CardTitle className="text-2xl">Join {invitation.workspace.name}</CardTitle>
        <CardDescription>
          {invitation.inviter.name} has invited you to collaborate.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!session ? (
          <Button className="w-full" onClick={() => router.push("/login")}>
            Sign in to Accept
          </Button>
        ) : isWrongUser ? (
          <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-600 text-sm border border-yellow-500/20">
            This invite was sent to <strong>{invitation.email}</strong>, but you are logged in as <strong>{session.user.email}</strong>.
          </div>
        ) : (
          <Button 
            className="w-full" 
            size="lg" 
            onClick={() => acceptInvite()} 
            disabled={isPending}
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Accept Invitation"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}