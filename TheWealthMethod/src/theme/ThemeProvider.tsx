import React, { createContext, useContext, useMemo, useEffect } from "react";
import { useColorScheme, Appearance, StyleSheet } from "react-native";
import * as SystemUI from "expo-system-ui";
import { useThemeStore, ThemeMode } from "../store/themeStore";
import { darkColors, lightColors, AppColors } from "./colors";
import { spacing, radius } from "./spacing";
import { typography } from "./typography";

export type Theme = {
  colors: AppColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  effects: {
    shadows: {
      ambient: {
        shadowColor: string;
        shadowOffset: { width: number; height: number };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
      };
    };
    gradients: {
      primary: [string, string];
    };
    glass: {
      backgroundColor: string;
      backdropFilter: string; // for web/future use, though we'll use BlurView in RN
    };
  };
};

type ThemeContextType = {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { themeMode, setThemeMode } = useThemeStore();
  const colorScheme = useColorScheme();
  const [systemColorScheme, setSystemColorScheme] = React.useState(colorScheme);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newScheme }) => {
      setSystemColorScheme(newScheme);
    });
    return () => subscription.remove();
  }, []);

  const isDark = useMemo(() => {
    const effectiveScheme = systemColorScheme || colorScheme || Appearance.getColorScheme();
    const result = themeMode === "dark" || (themeMode === "system" && effectiveScheme === "dark");
    return result;
  }, [themeMode, systemColorScheme, colorScheme]);

  const theme = useMemo<Theme>(() => {
    const colorsObj = isDark ? darkColors : lightColors;
    
    return {
      colors: colorsObj,
      spacing,
      radius,
      typography,
      effects: {
        shadows: {
          ambient: {
            shadowColor: "#191c1d",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.04,
            shadowRadius: 32,
            elevation: 4, // for android
          },
        },
        gradients: {
          primary: [colorsObj.primary, colorsObj.primaryContainer],
        },
        glass: {
          backgroundColor: colorsObj.surface + "B3", // 70% opacity
          backdropFilter: "blur(20px)",
        },
      },
    };
  }, [isDark]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background).catch(() => {});
  }, [theme.colors.background]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, isDark, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
};

/**
 * A hook to create themed styles that are automatically re-computed when the theme changes.
 * This pattern is more efficient than manual useMemo in every screen.
 */
export const useThemedStyles = <T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
  styleFactory: (theme: Theme) => T
) => {
  const { theme } = useAppTheme();
  // We use useMemo but ensure styleFactory result is passed through StyleSheet.create
  // for native performance (it registers the style objects once per theme change).
  return useMemo(() => StyleSheet.create(styleFactory(theme)), [theme, styleFactory]);
};
