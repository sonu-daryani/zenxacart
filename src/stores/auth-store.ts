import { create } from "zustand";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthResult = { ok: true; user: User } | { ok: false; error: string };

type AuthState = {
  user: User | null;
  isLoading: boolean;
  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<AuthResult>;
};

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error ?? fallback;
  } catch {
    return fallback;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  bootstrap: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) {
        set({ user: null, isLoading: false });
        return;
      }
      const data = (await res.json()) as { user: User | null };
      set({ user: data.user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  login: async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        return { ok: false, error: await parseError(res, "Login failed") };
      }
      const data = (await res.json()) as { user: User };
      set({ user: data.user });
      return { ok: true, user: data.user };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  },

  register: async (name, email, password) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        return {
          ok: false,
          error: await parseError(res, "Could not create account"),
        };
      }
      const data = (await res.json()) as { user: User };
      set({ user: data.user });
      return { ok: true, user: data.user };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* clear locally regardless */
    }
    set({ user: null });
  },

  updateProfile: async (data) => {
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        return {
          ok: false,
          error: await parseError(res, "Could not update profile"),
        };
      }
      const payload = (await res.json()) as { user: User };
      set({ user: payload.user });
      return { ok: true, user: payload.user };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  },
}));
