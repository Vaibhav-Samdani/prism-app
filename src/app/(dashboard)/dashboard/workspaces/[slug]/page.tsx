import React from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Users, 
  LayoutGrid, 
  List, 
  Settings, 
  MoreHorizontal, 
  ArrowUpRight,
  Clock,
  CheckCircle2
} from "lucide-react";

import DashboardHeader from "@/components/layout/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PROJECTS = [
  {
    id: 1,
    name: "Mobile App Redesign",
    description: "Modernizing the core customer experience with React Native.",
    progress: 75,
    tasks: 12,
    members: ["A", "B", "C"],
    category: "Development",
    updated: "2h ago",
  },
  {
    id: 2,
    name: "Marketing Q4",
    description: "Global campaign assets and landing page optimization.",
    progress: 32,
    tasks: 8,
    members: ["S", "M"],
    category: "Marketing",
    updated: "5h ago",
  },
  {
    id: 3,
    name: "API Infrastructure",
    description: "Scaling the backend to handle 10k concurrent requests.",
    progress: 90,
    tasks: 4,
    members: ["R", "D", "K", "L"],
    category: "DevOps",
    updated: "1d ago",
  },
];

export default function WorkspacePage() {
  return (
    <div className="min-h-screen bg-background/50">
      <DashboardHeader
        title="Acme Workspace"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Workspaces", href: "/dashboard/workspaces" },
          { label: "Acme Workspace" },
        ]}
        rightSlot={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button size="sm" className="shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        }
      />

      <main className="container max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Hero Section: Workspace Identity */}
        <section className="relative overflow-hidden rounded-2xl border bg-linear-to-b from-muted/50 to-background p-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-xl">
                  A
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Acme Global</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="rounded-full px-2.5">Owner</Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3.3 w-3.3" />
                      Updated 2 mins ago
                    </div>
                  </div>
                </div>
              </div>
              <p className="max-w-xl text-muted-foreground leading-relaxed">
                Central hub for the engineering and design teams. Use this space to track 
                sprints, manage deployments, and collaborate on cross-functional initiatives.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="flex -space-x-3">
                {["A", "R", "S", "M", "K"].map((c, i) => (
                  <Avatar key={i} className="h-10 w-10 border-4 border-background shadow-sm">
                    <AvatarFallback className="bg-muted text-xs font-semibold">{c}</AvatarFallback>
                  </Avatar>
                ))}
                <div className="h-10 w-10 rounded-full bg-muted border-4 border-background flex items-center justify-center text-[10px] font-bold">
                  +12
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-full">
                <Users className="mr-2 h-4 w-4" />
                Manage Team
              </Button>
            </div>
          </div>
          
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary/5 blur-[120px]" />
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Active Projects", value: "12", icon: LayoutGrid, color: "text-blue-500" },
            { label: "Tasks Completed", value: "128", icon: CheckCircle2, color: "text-emerald-500" },
            { label: "Team Velocity", value: "94%", icon: ArrowUpRight, color: "text-orange-500" },
          ].map((stat, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="opacity-50" />

        {/* Project Browser */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search projects..." className="pl-9 bg-background" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Tabs defaultValue="grid" className="w-fit">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="grid"><LayoutGrid className="h-4 w-4" /></TabsTrigger>
                  <TabsTrigger value="list"><List className="h-4 w-4" /></TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline">Filters</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((project) => (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="group">
                <Card className="h-full transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/5 group-hover:-translate-y-0.5 border-primary/2  hover:border-indigo-500 overflow-hidden relative">
                  {/* <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" /> */}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="bg-primary/5 text-primary border-none font-medium">
                        {project.category}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Project</DropdownMenuItem>
                          <DropdownMenuItem>Archive</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">Progress</span>
                        <span className="font-bold">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5" />
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center">
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-emerald-500" />
                        {project.tasks}
                      </span>
                      <div className="flex -space-x-2">
                        {project.members.map((m, i) => (
                          <div key={i} className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-bold">
                            {m}
                          </div>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs uppercase tracking-wider font-semibold">
                      {project.updated}
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
            
            {/* Empty State / Quick Add Card */}
            <button className="h-full min-h-55 rounded-xl border-2 border-dashed border-muted hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 group">
              <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                Add New Project
              </span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}