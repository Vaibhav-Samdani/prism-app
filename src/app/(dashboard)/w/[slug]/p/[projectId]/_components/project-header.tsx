// src/app/dashboard/w/[slug]/projects/[projectId]/_components/project-header.tsx
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Sparkles, Settings, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export function ProjectHeader({ activeTab, project, slug, workspace }: any) {
  return (
    <header className="sticky top-0 z-40 h-14 shrink-0 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 transition-all">
      
      {/* Left: Breadcrumbs & Mode Switcher */}
      <div className="flex items-center gap-5">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Link href={`/dashboard/w/${slug}`} className="hover:text-foreground transition-colors px-1 rounded-md hover:bg-muted">
            Projects
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          <span className="text-foreground truncate max-w-[150px] px-1">
            {project?.name || "Project Hub"}
          </span>
        </div>
        
        <div className="h-4 w-px bg-border/80" />
        
        {/* Mode Switcher (Sleek pill design) */}
        <TabsList className="h-8 bg-transparent space-x-1 p-0">
          <TabsTrigger value="tasks" className="rounded-md data-[state=active]:bg-muted data-[state=active]:shadow-none text-xs px-3 h-7">
            Board
          </TabsTrigger>
          <TabsTrigger value="docs" className="rounded-md data-[state=active]:bg-muted data-[state=active]:shadow-none text-xs px-3 h-7">
            Docs
          </TabsTrigger>
          <TabsTrigger value="canvas" className="rounded-md data-[state=active]:bg-muted data-[state=active]:shadow-none text-xs px-3 h-7">
            Canvas
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Right: Presence, AI Pulse, Actions */}
      <div className="flex items-center gap-4">
        
        {/* Online Presence (Overlapping Avatars) */}
        <div className="hidden md:flex items-center -space-x-2 mr-2">
          <Avatar className="w-7 h-7 border-2 border-background z-20"><AvatarFallback className="text-[10px] bg-blue-100 text-blue-700">VS</AvatarFallback></Avatar>
          <Avatar className="w-7 h-7 border-2 border-background z-10"><AvatarFallback className="text-[10px] bg-emerald-100 text-emerald-700">PJ</AvatarFallback></Avatar>
          <div className="w-7 h-7 rounded-full border-2 border-background z-0 bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
            +2
          </div>
        </div>

        {/* AI Pulse Badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md border border-blue-100 dark:border-blue-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>On track</span>
        </div>
        
        {/* CMD+K Trigger */}
        <Button variant="outline" size="sm" className="h-8 hidden md:flex items-center gap-2 text-muted-foreground bg-muted/20 border-border/50 hover:bg-muted/50">
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs font-normal">Search...</span>
          <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded bg-muted px-1 font-sans text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </Button>

        <div className="h-4 w-px bg-border/80 hidden sm:block" />

        {/* Settings */}
        {workspace?.currentUserRole !== "MEMBER" && (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>
    </header>
  );
}