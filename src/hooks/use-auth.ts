"use client";

import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "@/stores/auth-store";

export function useAuth() {
  return useAuthStore(
    useShallow((s) => ({
      user: s.user,
      isLoading: s.isLoading,
      login: s.login,
      register: s.register,
      logout: s.logout,
      updateProfile: s.updateProfile,
    }))
  );
}
