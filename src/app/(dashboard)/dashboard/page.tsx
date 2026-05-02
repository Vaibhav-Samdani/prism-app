"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Briefcase, CalendarClock, AlertCircle, ArrowRight, CheckCircle2, Clock, Plus } from "lucide-react";
import Link from "next/link";

function useDashboardData() {
  return useQuery({
    queryKey: ["global-dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      
      // 1. If the API returned an error (e.g., 401 Unauthorized, 500 Server Error)
      // Throw it so React Query catches it and stops executing.
      if (!res.ok) {
        throw new Error(json.error || "Failed to fetch dashboard data");
      }

      // 2. React Query strictly forbids returning `undefined`.
      // Use the nullish coalescing operator (??) to return `null` if json.data is missing.
      return json.data ?? null; 
    },
  });
}

export default function GlobalDashboardPage() {
  const { data, isLoading } = useDashboardData();

  // Dynamic Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center w-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {greeting}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here is a snapshot of your work across all workspaces today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex">
            View Schedule
          </Button>
          <Button className="gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* --- STATS ROW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Due Today</CardTitle>
            <CalendarClock className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats?.dueTodayCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Tasks requiring immediate attention</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Tasks</CardTitle>
            <AlertCircle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{data?.stats?.overdueCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Tasks past their deadline</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Workspaces</CardTitle>
            <Briefcase className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats?.totalWorkspaces || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Where you are currently a member</p>
          </CardContent>
        </Card>
      </div>

      {/* --- MAIN GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: My Priorities (Tasks) - Takes up 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">My Priorities</h2>
            <Link href="/dashboard/tasks" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center">
              View all <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          
          <Card className="shadow-sm border-border/60">
            {(!data?.tasks || data.tasks.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-sm font-medium">You're all caught up!</h3>
                <p className="text-xs text-muted-foreground mt-1">No pending tasks assigned to you right now.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {data.tasks.map((task: any) => (
                  <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/30 transition-colors group cursor-pointer">
                    <div className="flex items-start gap-3">
                      <button className="mt-0.5 w-4 h-4 rounded border border-muted-foreground/40 text-transparent hover:border-primary hover:text-primary transition-colors flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3" />
                      </button>
                      <div>
                        <p className="text-sm font-medium leading-none mb-1.5">{task.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" /> {task.workspace.name}
                          </span>
                          {task.dueDate && (
                            <>
                              <span>•</span>
                              <span className={`flex items-center gap-1 ${new Date(task.dueDate) < new Date() ? 'text-destructive' : ''}`}>
                                <Clock className="w-3 h-3" /> 
                                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Badge variant="secondary" className="mt-3 sm:mt-0 w-fit text-[10px] uppercase font-semibold">
                      {task.priority || "Medium"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT COLUMN: Quick Access (Workspaces) - Takes up 1 col */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Quick Access</h2>
          
          <div className="grid grid-cols-1 gap-3">
            {data?.workspaces?.map((ws: any) => (
              <Link key={ws.id} href={`/dashboard/w/${ws.slug}`}>
                <Card className="shadow-sm border-border/60 hover:border-primary/50 transition-colors cursor-pointer group">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-secondary border border-border flex items-center justify-center text-secondary-foreground font-bold text-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {ws.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium leading-tight">{ws.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {ws._count.memberships} member{ws._count.memberships !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            
            {/* Create New Workspace Button */}
            <Button variant="outline" className="w-full h-14 border-dashed text-muted-foreground hover:text-foreground">
              <Link href="/dashboard/onboarding" className="flex"> 
                <Plus className="w-4 h-4 mr-2" />
                Create new workspace
              </Link>
            </Button>
          </div>
          

          
        </div>

      </div>
    </div>
  );
}