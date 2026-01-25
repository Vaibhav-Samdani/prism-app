"use client";

import { UserInfo, UserStore } from "@/types/stores";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const userState = (set: any): UserStore => ({
  name: "",
  email: "",
  profileImage: "",
  userName: "",

  setUserInfo: (user: UserInfo) =>
    set((state: UserStore) => ({
      ...state,
      ...user,
    })),

  clearUser: () =>
    set({
      name: "",
      email: "",
      profileImage: "",
      userName: "",
    }),
});

export const useUserStore = create<UserStore>()(
  devtools(
    persist(userState, {
      name: "user-store",
      version: 1,
      partialize: (state) => ({
        name: state.name,
        email: state.email,
        profileImage: state.profileImage,
        userName: state.userName,
      }),
    }),
  ),
);
