export interface Workspace {
  id: string;
  name: string;
  slug: string;
  memberships: {
    user: {
      id: string;
      email: string;
      name: string | null;
    };
    role: "OWNER" | "ADMIN" | "MEMBER";
  }[];
}
