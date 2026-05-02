export type WorkspaceRole = "OWNER" | "ADMIN" | "MEMBER";

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string[] | null;
  status: "ACTIVE" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMembership {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  role: WorkspaceRole;
}

export type WorkspaceResponse = {
  success: boolean;
  message: string;
  data: {
    workspace: Workspace;
    stats: WorkspaceStats;
  };
  error?: string; 
};

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;

  currentUserRole: WorkspaceRole;

  memberships: WorkspaceMembership[];
  projects: Project[];
}

export type WorkspaceStats = {
  active: number;
  task_completed_this_week: number;
  team_velocity: number;
};
