'use client'
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <h1 className="text-2xl font-semibold">Prism</h1>
      <Button onClick={() => alert("Nice Try")}>Click Me</Button>
    </div>
  );
}
