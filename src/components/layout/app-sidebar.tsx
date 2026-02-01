"use client";

import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { LayoutGrid, CheckSquare, Settings, Building2 } from "lucide-react";
import WorkspaceSwitcher from "./workspace-switcher";
import Link from "next/link";

const MIDDLE_DATA = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutGrid />,
  },
  {
    title: "Workspaces",
    href: "/dashboard/workspaces",
    icon: <Building2 />,
  },
  {
    title: "My Tasks",
    href: "/dashboard/tasks",
    icon: <CheckSquare />,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader className="space-y-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Prism</h1>
          <p className="text-xs text-muted-foreground">
            From complexity to clarity
          </p>
        </div>

        <WorkspaceSwitcher />
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {MIDDLE_DATA.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <a href={item.href}>
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/settings">
                <Settings />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
