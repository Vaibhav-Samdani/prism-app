"use client";
import { useAuthSession } from "@/hooks/use-auth-session";
import React from "react";

const ZustandProviders = ({ children }: { children: React.ReactNode }) => {
  useAuthSession();
  return <>{children}</>;
};

export default ZustandProviders;
