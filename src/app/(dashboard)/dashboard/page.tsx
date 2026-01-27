'use client';

import DashboardHeader from "@/components/layout/dashboard-header";
import { useAuthStore } from "@/store/use-auth-store";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <>
      <DashboardHeader
        title="Dashboard"
        breadcrumbs={[
          { label: "Workspace", href: "/dashboard" },
          { label: "Dashboard" },
        ]}
      />

      <div className="p-6">
        <p className="text-muted-foreground">Welcome, {user?.name}.</p>
      </div>
    </>
  );
}
