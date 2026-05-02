"use client";
import { MorphingSquare } from "@/components/ui/loader";
import { useSession } from "@/lib/auth-client";
import { useEffect } from "react";

export default function Home() {
  const { data, isRefetching, isPending } = useSession();

  useEffect(() => {
    console.log(data);
  }, []);

  if (isRefetching || isPending) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <MorphingSquare message="Loading..." />
      </div>
    );
  }

  const user = data?.user;

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background">
      <h1 className="text-2xl font-semibold">Prism</h1>
      <br />
      <h1 className="text-2xl font-semibold">{user?.name.toUpperCase()}</h1>
      <br />
      <h1 className="text-2xl font-semibold">{user?.email.toLowerCase()}</h1>
      <br />
      <h1 className="text-2xl font-semibold">{user?.image}</h1>
      <br />
    </div>
  );
}
