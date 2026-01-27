"use client";
import { useAuthSession } from "@/hooks/use-auth-session";
import React from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  useAuthSession();
  return <>{children}</>;
};

export default Providers;
