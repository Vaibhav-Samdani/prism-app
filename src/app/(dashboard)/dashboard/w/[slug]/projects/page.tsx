import React from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Activity,
  Zap,
  Filter
} from "lucide-react";

import DashboardHeader from "@/components/layout/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

export default function WorkspacePage() {
  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-[#09090b]">
      <DashboardHeader
        title="Acme Workspace"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Workspaces", href: "/dashboard/workspaces" },
          { label: "Acme Workspace" },
        ]}
        rightSlot={
          <Button size="sm" className="rounded-xl px-4 font-semibold shadow-md transition-all active:scale-95">
            <Plus className="mr-2 h-4 w-4 stroke-[3px]" />
            Create Project
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto p-6 space-y-10">
        
        {/* Workspace Identity Card */}
        <div className="group relative rounded-4xl border bg-card p-1 shadow-sm transition-all hover:shadow-xl hover:shadow-primary/5">
          <div className="flex flex-col lg:flex-row gap-8 p-8">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary/60 text-2xl font-bold text-white shadow-inner">
                  AW
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold italic tracking-tighter">ACME_SYSTEMS</h2>
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none rounded-lg">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Enterprise Workspace • 12 Members</p>
                </div>
              </div>
              <p className="max-w-2xl text-base text-muted-foreground/80 leading-relaxed">
                The central nervous system for Acme's digital infrastructure. 
                Everything from the core API to our global marketing presence is orchestrated here.
              </p>
            </div>

            <div className="flex flex-col justify-between items-start lg:items-end gap-6 border-t lg:border-t-0 lg:border-l border-border/50 pt-6 lg:pt-0 lg:pl-8">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar key={i} className="h-10 w-10 border-4 border-card ring-1 ring-border shadow-sm transition-transform hover:-translate-y-1">
                      <AvatarFallback className="text-xs bg-muted">M{i}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="rounded-xl border-dashed border-2 px-4 hover:bg-primary/5">
                  <Plus className="h-4 w-4 mr-1" /> Invite
                </Button>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Uptime</p>
                  <p className="text-lg font-mono font-bold">99.9%</p>
                </div>
                <div className="h-10 w-px bg-border/50" />
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Region</p>
                  <p className="text-lg font-mono font-bold">US-EST</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Explorer Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight">Active Projects</h3>
              <p className="text-sm text-muted-foreground">Monitoring 3 active workstreams</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="w-64 pl-9 rounded-xl border-muted-foreground/20 focus-visible:ring-primary/20" />
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl border"><Filter className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Mobile Experience", color: "bg-violet-500", progress: 68, tasks: 12 },
              { title: "Cloud Integration", color: "bg-blue-500", progress: 42, tasks: 8 },
              { title: "Market Research", color: "bg-orange-500", progress: 89, tasks: 4 },
            ].map((p, idx) => (
              <Link key={idx} href="#" className="group">
                <Card className="h-full rounded-[1.75rem] border-muted-foreground/10 bg-card transition-all duration-300 hover:scale-[1.02] hover:bg-muted/30 hover:shadow-2xl hover:shadow-primary/5 active:scale-[0.98]">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`h-10 w-10 rounded-xl ${p.color} bg-opacity-10 flex items-center justify-center`}>
                        <Zap className={`h-5 w-5 ${p.color.replace('bg-', 'text-')}`} />
                      </div>
                      <Badge variant="outline" className="rounded-lg font-mono text-[10px] uppercase opacity-70">Project_ID: 00{idx+1}</Badge>
                    </div>
                    <CardTitle className="text-lg tracking-tight group-hover:text-primary transition-colors">{p.title}</CardTitle>
                    <CardDescription className="line-clamp-2 leading-relaxed">
                      Optimizing cross-platform performance metrics for the next production cycle.
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <span>Status</span>
                        <span className="text-foreground">{p.progress}%</span>
                      </div>
                      <Progress value={p.progress} className="h-1.5 bg-muted" />
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Activity className="h-3 w-3" />
                      {p.tasks} pending tasks
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}