"use client";

import DashboardHeader from "@/components/layout/dashboard-header";
import { Button } from "@/components/ui/button";
import { MorphingSquare } from "@/components/ui/loader";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useAuthStore } from "@/store/use-auth-store";
import { useWorkspaceStore } from "@/store/workspace-store";
import { Plus, Settings } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { workspaces, isLoading } = useWorkspaces();

  const { activeWorkspaceId } = useWorkspaceStore();

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <MorphingSquare message="Loading..." />
      </div>
    );
  }

  return (
    <>
      <DashboardHeader
        title="Workspaces"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Workspaces" },
        ]}
        rightSlot={
          <div className="flex items-center gap-2">
            <Button size="sm" className="shadow-lg shadow-primary/20">
              <Link href="/dashboard/onboarding" className="flex"> 
                <Plus className="mr-1 h-4 w-4" />
                Create workspace
              </Link>
            </Button>
          </div>
        }
      />

      {/* <div className="p-6">
        <p className="text-muted-foreground">Welcome, {user?.name}.</p>
      </div> */}
      {/* TODO: Make it Link */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/dashboard/w/${workspace.slug}`}
              className="group relative rounded-xl border bg-background shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Top cover */}
              <div className="h-24 rounded-t-xl bg-linear-to-br from-indigo-500 to-indigo-600" />

              {/* Content */}
              <div className="p-4">
                {/* Workspace avatar */}
                <div className="-mt-10 mb-3">
                  <div className="h-12 w-12 rounded-lg bg-background border shadow flex items-center justify-center group-hover:scale-105 transition-transform">
                    <div className="h-5 w-5 rounded-md bg-indigo-500" />
                  </div>
                </div>

                {/* Workspace name */}
                <h3 className="text-base font-semibold leading-tight">
                  {workspace.name}
                </h3>

                {/* Meta / role */}
                <p className="mt-1 text-sm text-muted-foreground">
                  {workspace.memberships?.[0]?.role ?? "Member"}
                </p>
              </div>

              {/* Hover affordance */}
              <div className="absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-indigo-500/30 transition" />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
