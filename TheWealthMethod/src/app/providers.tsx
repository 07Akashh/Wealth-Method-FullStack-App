import { Toasts } from "@backpackapp-io/react-native-toast";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  Theme,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Notifications from "expo-notifications";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AddGoalBottomSheet } from "../components/modals/AddGoalBottomSheet";
import { AddTransactionBottomSheet } from "../components/modals/AddTransactionBottomSheet";
import { useAppLock } from "../hooks/useAppLock";
import QueryProvider from "../lib/TanstackQuery/QueryProvider";
import { RootNavigator } from "../navigation/RootNavigator";
import { AuthLockScreen } from "../screens/Auth/AuthLockScreen";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import { ThemeProvider, useAppTheme } from "../theme/ThemeProvider";

const NavigationWrapper: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const { isAppLocked, biometricsEnabled, pinEnabled, setAppLocked, hasHydrated } = useUserStore();

  useAppLock({
    enabled: biometricsEnabled || pinEnabled,
    isLocked: isAppLocked,
    setLocked: setAppLocked,
  });

  const { isAuthenticated, hasHydrated: hasAuthHydrated } = useAuthStore();

  if (!hasHydrated || !hasAuthHydrated) return null;

  const navTheme: Theme = {
    dark: isDark,
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surfaceContainer,
      text: theme.colors.onSurface,
      border: theme.colors.outlineVariant,
      notification: theme.colors.primary,
    },
    fonts: {
      regular: { fontFamily: "System", fontWeight: "400" },
      medium: { fontFamily: "System", fontWeight: "500" },
      bold: { fontFamily: "System", fontWeight: "700" },
      heavy: { fontFamily: "System", fontWeight: "800" },
    },
  };

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} animated />
      <NavigationContainer theme={navTheme}>
        {isAppLocked && isAuthenticated ? (
          <AuthLockScreen />
        ) : (
          <BottomSheetModalProvider>
            <RootNavigator />
            <AddTransactionBottomSheet />
            <AddGoalBottomSheet />
          </BottomSheetModalProvider>
        )}
      </NavigationContainer>
    </>
  );
};



export const AppProviders: React.FC = () => {
  useEffect(() => {
    (async () => {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
      }
    })();
  }, []);

  return (
    <QueryProvider>
      <ThemeProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <Toasts />
            <NavigationWrapper />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryProvider>
  );
};
