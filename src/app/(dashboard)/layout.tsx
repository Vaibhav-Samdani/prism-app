import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <SidebarProvider>
      <div className="flex w-full h-screen bg-background text-foreground">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto w-full ">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
