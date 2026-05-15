import NetInfo from "@react-native-community/netinfo";
import { QueryClientProvider, focusManager, onlineManager } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import toastHandler from "../../Functions/Toasthandler";
import { queryClient } from "./queryClient";

const toast = toastHandler();

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

interface QueryProviderProps {
  children: React.ReactNode;
}

const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = !!state.isConnected && !!state.isInternetReachable;
      
      const wasOnline = onlineManager.isOnline();
      onlineManager.setOnline(isOnline);

      if (wasOnline && !isOnline) {
        toast("warn", "Connection Lost. Transitioning to offline mode.");
      } else if (!wasOnline && isOnline) {
        toast("sus", "Connection Restored. Synchronizing vault data...");
      }
    });

    return () => {
      subscription.remove();
      unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;
