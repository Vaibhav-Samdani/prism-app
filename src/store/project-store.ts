import { create } from "zustand";

interface ProjectState {
  // Track the currently viewed project ID
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;

  // Track if the "Quick Create" modal is open (useful for global sidebar buttons)
  isCreateModalOpen: boolean;
  setCreateModalOpen: (isOpen: boolean) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  activeProjectId: null,
  setActiveProjectId: (id) => set({ activeProjectId: id }),

  isCreateModalOpen: false,
  setCreateModalOpen: (isOpen) => set({ isCreateModalOpen: isOpen }),
}));