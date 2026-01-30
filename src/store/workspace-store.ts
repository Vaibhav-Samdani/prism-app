import { create } from "zustand";
import { persist } from "zustand/middleware";

type WorkspaceState = {
  activeWorkspaceId: string | null;
  setActiveWorkspaceId: (id: string) => void;
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      activeWorkspaceId: null,
      setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),
    }),
    {
      name: "workspace-store", // key in storage
      partialize: (state) => ({
        activeWorkspaceId: state.activeWorkspaceId
      }),
    },
  ),
);
