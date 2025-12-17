"use client";

import Link from "next/link";
import { LayoutGrid, CheckSquare, Settings } from "lucide-react";
import WorkspaceSwitcher from "./workspace-switcher";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      {/* App Identity */}
      <div className="px-4 py-4 border-b border-border">
        <h1 className="text-lg font-semibold tracking-tight">
          Prism
        </h1>
        <p className="text-xs text-muted-foreground">
          From complexity to clarity
        </p>
      </div>

      <WorkspaceSwitcher />

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-1">
        <SidebarItem href="/dashboard" icon={<LayoutGrid size={16} />}>
          Dashboard
        </SidebarItem>

        <SidebarItem href="/dashboard/tasks" icon={<CheckSquare size={16} />}>
          My Tasks
        </SidebarItem>
      </nav>

      {/* Bottom Section */}
      <div className="px-2 py-3 border-t border-border">
        <SidebarItem href="/settings" icon={<Settings size={16} />}>
          Settings
        </SidebarItem>
      </div>
    </aside>
  );
}

function SidebarItem({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="sidebar-item"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
