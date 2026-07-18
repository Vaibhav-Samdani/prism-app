import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type WorkspaceState = {
  activeWorkspaceId: string | null;
  setActiveWorkspaceId: (id: string) => void;
};

export const useWorkspaceStore = create<WorkspaceState>()(
  devtools(
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
    {
      name: "AuthStore",
    },
  ),
);
