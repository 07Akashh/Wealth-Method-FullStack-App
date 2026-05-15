import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { STORAGE_KEYS } from "../services/storage";
import { AuthResponse } from "../services/authService";
import { zustandSecureStorage } from "../utils/secureStore";

type AuthState = {
  hasHydrated: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  isTempPass: boolean;
  role: string | null;
  token: string | null;
  profile: AuthResponse["profile"] | null;
  setHasCompletedOnboarding: (value: boolean) => void;
  setHasHydrated: (value: boolean) => void;
  login: (payload: AuthResponse) => void;
  updateProfile: (profile: AuthResponse["profile"]) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      isTempPass: false,
      role: null,
      token: null,
      profile: null,
      setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
      login: (payload) =>
        set({
          isAuthenticated: true,
          hasCompletedOnboarding: true,
          token: payload.accessToken,
          role: payload.profile.role,
          profile: payload.profile,
          isTempPass: payload.isTempPass,
        }),
      updateProfile: (profile) => set({ profile }),
      logout: () =>
        set({
          isAuthenticated: false,
          role: null,
          token: null,
          profile: null,
          isTempPass: false,
        }),
    }),
    {
      name: STORAGE_KEYS.AUTH,
      storage: createJSONStorage(() => zustandSecureStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        role: state.role,
        token: state.token,
        profile: state.profile,
        isTempPass: state.isTempPass,
      }),
    },
  ),
);
