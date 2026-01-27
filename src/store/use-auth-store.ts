"use client";
import { create } from "zustand";

import { persist, devtools } from "zustand/middleware";

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,

        setUser: (user) =>
          set({
            user,
            isAuthenticated: true,
          }),

        clearUser: () =>
          set({
            user: null,
            isAuthenticated: false,
          }),
      }),
      {
        name: "auth-store", // key in storage
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    {
      name: "AuthStore",
    },
  ),
);
