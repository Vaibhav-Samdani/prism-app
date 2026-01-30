import React from "react";
import ZustandProviders from "./zustand-provider";
import { QueryProvider } from "./query-provider";
import ToastProvider from "./toast-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <QueryProvider>
        <ZustandProviders>
          <ToastProvider>{children}</ToastProvider>
        </ZustandProviders>
      </QueryProvider>
    </div>
  );
};

export default Providers;
