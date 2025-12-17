import DashboardHeader from "@/components/layout/dashboard-header";

export default function DashboardPage() {
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
        <p className="text-muted-foreground">
          Welcome to Prism.
        </p>
      </div>
    </>
  );
}
