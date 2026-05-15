import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_KEYS } from "../services/storage";

export type ThemeMode = "system" | "light" | "dark";

type ThemeState = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeMode: "light", // Default to light as per "The Architectural Finance Method"
      setThemeMode: (mode) => set({ themeMode: mode }),
    }),
    {
      name: "the-wealth-method-theme",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
