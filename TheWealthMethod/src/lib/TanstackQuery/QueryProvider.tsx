import { QueryClient, QueryClientProvider, focusManager, onlineManager, QueryCache, MutationCache } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { AppState, Platform, AppStateStatus } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import toastHandler from "../../Functions/Toasthandler";

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

  const queryClientRef = useRef(
    new QueryClient({
      queryCache: new QueryCache({
        onError: (error: any, query) => {
          if (query.meta?.errorMessage) {
            toast("dan", query.meta.errorMessage as string);
          } else if (error.message && !error.message.includes("canceled")) {
             console.warn(`[Query Error]: ${error.message}`);
          }
        },
      }),
      mutationCache: new MutationCache({
        onError: (error: any) => {
          const message = error.message || "Action could not be completed.";
          toast("dan", message);
        },
        onSuccess: (data: any, variables, context, mutation) => {
          if (mutation.meta?.successMessage) {
            toast("sus", mutation.meta.successMessage as string);
          }
        }
      }),
      defaultOptions: {
        queries: {
          retry: 1, 
          refetchOnWindowFocus: true, 
          refetchOnReconnect: true,
          staleTime: 30000, 
        },
      },
    })
  );

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;
