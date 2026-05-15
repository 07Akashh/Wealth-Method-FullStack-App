import {
  NavigationContainer,
  Theme,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import React from "react";
import { AppState, AppStateStatus } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Toasts } from "@backpackapp-io/react-native-toast";

import { RootNavigator } from "../navigation/RootNavigator";
import { ThemeProvider, useAppTheme } from "../theme/ThemeProvider";
import QueryProvider from "../lib/TanstackQuery/QueryProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AddTransactionBottomSheet } from "../components/modals/AddTransactionBottomSheet";
import { AddGoalBottomSheet } from "../components/modals/AddGoalBottomSheet";
import { AuthLockScreen } from "../screens/Auth/AuthLockScreen";
import { useUserStore } from "../store/userStore";
import { useAuthStore } from "../store/authStore";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

const NavigationWrapper: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const { isAppLocked, biometricsEnabled, pinEnabled, setAppLocked, hasHydrated } = useUserStore();

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // Lock the app if it's inactive or background and biometrics are enabled
      if (
        nextAppState.match(/inactive|background/) &&
        (biometricsEnabled || pinEnabled) &&
        !isAppLocked
      ) {
        setAppLocked(true);
      }
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [biometricsEnabled, isAppLocked, setAppLocked]);

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
