"use client";
import Link from "next/link";
import {
  Plus,
  Search,
  Users,
  LayoutGrid,
  List,
  Settings,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  SearchX,
  ArrowLeft,
  MoreHorizontal,
  Activity,
  Zap,
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

import DashboardHeader from "@/components/layout/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceData } from "@/hooks/use-workspace-data";
import { MorphingSquare } from "@/components/ui/loader";
import { useParams } from "next/navigation";
import RichTextViewer from "@/components/ui/rich-text-viewer";
import ExpandableRichText from "@/components/ui/expandable-rich-text-viewer";
import { formatDateTime } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { ProjectOptionsMenu } from "@/components/projects/project-options-menu";
import { useState } from "react";



function ProjectCard({ project, slug, workspaceId }: { project: any, slug: string, workspaceId: string }) {
  return (
    <Link href={`/w/${slug}/p/${project.id}`} className="group h-full">
      <Card className="h-full transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/5 border-primary/20 hover:border-indigo-500 overflow-hidden relative">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center justify-start gap-1">
              {project.category?.map((category: string, i: number) => (
                <Badge key={i} variant="outline" className="bg-primary/5 text-primary border-none font-medium">
                  {category}
                </Badge>
              ))}
            </div>
            <ProjectOptionsMenu workspaceId={workspaceId} project={project} />
          </div>
          <CardTitle className="text-xl group-hover:text-primary transition-colors mt-2">
            {project.name}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            <RichTextViewer
              className="prose prose-invert prose-sm max-w-none text-muted-foreground prose-h1:text-lg prose-p:my-2"
              content={project.description || ""}
            />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Progress</span>
              <span className="font-bold">50%</span>
            </div>
            <Progress value={50} className="h-1.5" />
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <CheckCircle2 className="mr-1 h-3.5 w-3.5 text-emerald-500" />
            <span>20 tasks</span>
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold">
            {formatDateTime(project.updatedAt)}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}




export default function WorkspacePage() {
  const params = useParams();
  const slug = params.slug as string;

  const { workspace, stats, isLoading, isError, errorMessage } =
    useWorkspaceData(slug);

    const memberships = workspace?.memberships || [];
  const displayCount = 5;
  const visibleMembers = memberships.slice(0, displayCount);
  const remainingCount = memberships.length - displayCount;

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 2. Derive unique categories dynamically from your projects
  const allCategories = Array.from(
    new Set(workspace?.projects.flatMap((p) => p.category || []))
  );


  const filteredProjects = workspace?.projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || project.category?.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <MorphingSquare message="Loading..." />
      </div>
    );
  }

  // 2. Handle Error State

  if (isError || !workspace) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-6">
          <SearchX className="h-10 w-10 text-destructive" />
        </div>

        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold tracking-tight">
            Workspace not found
          </h2>
          <p className="text-muted-foreground max-w-[300px]">
            {errorMessage ||
              "We couldn't find the workspace you're looking for. It might have been deleted or you may not have access."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/workspaces">View All Workspaces</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/50">
      <DashboardHeader
        title={workspace?.name || ""}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Workspaces", href: "/dashboard/workspaces" },
          { label: workspace?.name || "" },
        ]}
        rightSlot={ workspace.currentUserRole !== "MEMBER" &&
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button
              size="sm"
              className="shadow-lg shadow-primary/20 cursor-pointer"
            >
            <Link href={`/dashboard/workspaces/${slug}/projects/new`} className="flex">
              <Plus className="mr-2 h-4 w-4" />
                New Project
              </Link>
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
                  {workspace?.name?.charAt(0).toUpperCase() || "P"}
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {workspace?.name || ""}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="rounded-full px-2.5">
                      {workspace?.currentUserRole ?? "Member"}
                      {/* TODO: Update this as per the data as match the user id with membership id and then show the badge. */}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {formatDateTime(workspace.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="max-w-xl text-muted-foreground leading-relaxed">
                <ExpandableRichText content={workspace?.description || " "} />
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <Link 
          href={`/w/${slug}/members`} 
          className="flex -space-x-3 hover:opacity-90 transition-opacity cursor-pointer group"
          title="Manage team members"
        >
          {visibleMembers.map((membership: any) => {
            const user = membership.user;
            // Get the first letter of their name, fallback to "U"
            const initial = user?.name?.charAt(0).toUpperCase() || "U";
            
            return (
              <Avatar
                key={user.id}
                className="h-10 w-10 border-4 border-background shadow-sm transition-transform duration-200 group-hover:-translate-y-1"
              >
                {/* Tries to load the GitHub/Google profile pic first */}
                <AvatarImage src={user.image} alt={user.name} />
                {/* Falls back to their initial if no pic exists */}
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {initial}
                </AvatarFallback>
              </Avatar>
            );
          })}
          
          {/* Show the +X badge if there are more members than the display limit */}
          {remainingCount > 0 && (
            <div className="h-10 w-10 z-10 rounded-full bg-muted border-4 border-background flex items-center justify-center text-[10px] font-bold text-muted-foreground transition-transform duration-200 group-hover:-translate-y-1">
              +{remainingCount}
            </div>
          )}
          
          {/* Fallback while loading */}
          {memberships.length === 0 && (
            <div className="h-10 w-10 rounded-full bg-muted border-4 border-background flex items-center justify-center text-[10px] font-bold text-muted-foreground">
              ...
            </div>
          )}
        </Link>
              <Button variant="outline" size="sm" className="rounded-full">
                <Link href={`/w/${slug}/members`} className="flex">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Team
                </Link>
              </Button>
            </div>
          </div>

          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary/5 blur-[120px]" />
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Active Projects",
              value: stats?.active,
              icon: LayoutGrid,
              color: "text-blue-500",
            },
            {
              label: "Tasks Completed",
              value: stats?.task_completed_this_week,
              icon: CheckCircle2,
              color: "text-emerald-500",
            },
            {
              label: "Team Velocity",
              value: `${stats?.team_velocity}%`,
              icon: ArrowUpRight,
              color: "text-orange-500",
            },
          ].map((stat, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
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
        <Input
          placeholder="Search projects..."
          className="pl-9 bg-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>

    <div className="flex items-center gap-3">
      {/* Category Filter */}
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Categories</SelectItem>
          {allCategories.map((cat) => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* View Toggle */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')} className="w-fit">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grid"><LayoutGrid className="h-4 w-4" /></TabsTrigger>
          <TabsTrigger value="list"><List className="h-4 w-4" /></TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  </div>

  {/* Render based on View Mode */}
  {filteredProjects.length > 0 ? (
    viewMode === 'grid' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
           /* ... [Your existing Card Grid Code] ... */
           <ProjectCard 
      key={project.id} 
      project={project} 
      slug={slug} 
      workspaceId={workspace.id} 
    />
        ))}
      </div>
    ) : (
      <div className="border rounded-xl bg-card overflow-hidden">
        {filteredProjects.map((project) => (
          <Link 
            key={project.id} 
            href={`/w/${slug}/p/${project.id}`}
            className="flex items-center justify-between p-4 hover:bg-muted/50 border-b last:border-0 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                {project.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-sm">{project.name}</p>
                <p className="text-xs text-muted-foreground">{project.category?.join(', ')}</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Updated {formatDateTime(project.updatedAt)}
            </div>
          </Link>
        ))}
      </div>
    )
  ) : (
    <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-xl text-muted-foreground">
      <SearchX className="h-10 w-10 mb-2 opacity-50" />
      <p>No projects found matching your criteria.</p>
    </div>
  )}
</section>
      </main>
    </div>
  );
}
