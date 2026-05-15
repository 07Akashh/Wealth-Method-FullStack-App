import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

import { queryClient } from "../lib/TanstackQuery/queryClient";
import { STORAGE_KEYS } from "../services/storage";
import { useAuthStore } from "../store/authStore";
import { useBottomSheetStore } from "../store/bottomSheetStore";
import { useNotificationStore } from "../store/notificationStore";
import { useReceiptCaptureStore } from "../store/receiptCaptureStore";
import { useThemeStore } from "../store/themeStore";
import { useUserStore } from "../store/userStore";

const resetAuthState = () => {
  useAuthStore.setState({
    hasHydrated: true,
    isAuthenticated: false,
    hasCompletedOnboarding: false,
    isTempPass: false,
    temporaryPassword: null,
    role: null,
    token: null,
    profile: null,
  });
};

const resetUserState = () => {
  useUserStore.setState({
    firstName: "",
    lastName: "",
    name: "",
    email: "",
    phone: "",
    avatar: null,
    currency: "INR",
    currencySymbol: "₹",
    monthlyLimit: 500000,
    biometricsEnabled: false,
    privacyEnabled: true,
    isAppLocked: false,
    hasHydrated: true,
    pin: "",
    pinEnabled: false,
    wipeDataEnabled: false,
    exchangeRates: { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.009, JPY: 1.83, AUD: 0.018 },
  });
};

export const resetAppData = async () => {
  await queryClient.cancelQueries();
  queryClient.clear();

  useBottomSheetStore.getState().close();
  useReceiptCaptureStore.getState().close();
  useNotificationStore.getState().clearNotifications();
  useThemeStore.getState().setThemeMode("light");

  resetUserState();
  resetAuthState();

  await Promise.all([
    AsyncStorage.multiRemove([
      "user-storage",
      "notification-storage",
      "the-wealth-method-theme",
    ]),
    SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH),
    SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
  ]);
};