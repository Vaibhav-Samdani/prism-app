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
  useSidebar,
} from "@/components/ui/sidebar";

import { 
  LayoutGrid, 
  CheckSquare, 
  Settings, 
  Building2, 
  ChevronsUpDown, 
  Inbox,
  FolderKanban,
  Users,
  Calendar,
  CreditCard,
  User,
  LifeBuoy,
  Triangle,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutConfirmItem } from "../logout-confirm-item";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

// 1. YOUR WORK (Personal Navigation)
const NAV_PERSONAL = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutGrid className="w-4 h-4" />,
  },
  {
    title: "Inbox",
    href: "/dashboard/inbox",
    icon: <Inbox className="w-4 h-4" />,
  },
  {
    title: "My Tasks",
    href: "/dashboard/tasks",
    icon: <CheckSquare className="w-4 h-4" />,
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: <Calendar className="w-4 h-4" />,
  },
];

// 2. WORKSPACE (Team Navigation)
const NAV_WORKSPACE = [
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: <FolderKanban className="w-4 h-4" />,
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: <Users className="w-4 h-4" />,
  },
  {
    title: "All Workspaces",
    href: "/dashboard/workspaces",
    icon: <Building2 className="w-4 h-4" />,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  // We extract toggleSidebar here to manually control the collapse state
  const { open, toggleSidebar } = useSidebar();
  const { data, isRefetching, isPending } = useSession();

 
  const user = data?.user;

  return (
    <Sidebar collapsible="icon">
      
      {/* --- HEADER & LOGO --- */}
      <SidebarHeader className="space-y-3 pt-4 pb-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            {/* Improved Prism Logo */}
            <div className="flex -translate-x-1 aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Triangle className="size-4 fill-current rotate-180" />
            </div>
            
            {open && (
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-base tracking-tight">Prism</span>
                <span className="truncate text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Workspace</span>
              </div>
            )}
          </div>

          {/* Dedicated Collapse Toggle Button */}
          {open ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-muted-foreground hover:text-foreground" 
              onClick={toggleSidebar}
              title="Collapse Sidebar (Ctrl+B)"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          ) : (
            // When collapsed, we show a button to expand it right below the logo
            <div className="flex w-full justify-center mt-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-foreground" 
                onClick={toggleSidebar}
                title="Expand Sidebar (Ctrl+B)"
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* --- MAIN NAVIGATION --- */}
      <SidebarContent className="mt-2">
        
        {/* GROUP 1: Your Work */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Your Work
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_PERSONAL.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <a href={item.href} className="flex items-center gap-3 font-medium">
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* GROUP 2: Workspace */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_WORKSPACE.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <a href={item.href} className="flex items-center gap-3 font-medium">
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

      {/* --- FOOTER: USER MENU --- */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border border-transparent hover:border-border transition-colors mb-2"
                  >
                    <Avatar className="h-8 w-8 rounded-lg shadow-sm">
                    <AvatarImage src={user?.image || ""} alt={user?.name} />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border-border shadow-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.image} alt={user?.name} />
                      <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <a href="/profile">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      Profile
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <a href="/billing">
                      <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                      Billing
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <a href="/settings">
                      <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                      Account Settings
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <a href="/support">
                      <LifeBuoy className="mr-2 h-4 w-4 text-muted-foreground" />
                      Help & Support
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                <LogoutConfirmItem />
                
              </DropdownMenuContent>
            </DropdownMenu>)}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}