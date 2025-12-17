"use client";
import DashboardHeader from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/shared/empty-state";
import Link from "next/link";

const PROJECTS = [
  {
    id: "1",
    name: "Prism MVP",
    description: "Core project management features",
    status: "Active",
  },
  {
    id: "2",
    name: "College Assignment",
    description: "Final year submission",
    status: "Paused",
  },
];

export default function ProjectsPage() {
  return (
    <>
      <DashboardHeader
        title="Projects"
        breadcrumbs={[
          { label: "Workspace", href: "/dashboard" },
          { label: "Projects" },
        ]}
      />

      <div className="p-6">
        {PROJECTS.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Create a project to start organizing your work."
            actionLabel="Create project"
            onAction={() => {
              // later: open create-project dialog
              console.log("Create project");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROJECTS.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="group block"
              >
                <Card
                  className="
          transition
          hover:border-white/20
          hover:bg-white/[0.02]
          cursor-pointer
        "
                >
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-base font-medium group-hover:text-zinc-300">
                      {project.name}
                    </CardTitle>

                    <Badge variant="secondary" className="w-fit">
                      {project.status}
                    </Badge>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
