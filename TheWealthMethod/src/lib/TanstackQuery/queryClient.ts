import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import toastHandler from "../../Functions/Toasthandler";

const toast = toastHandler();

export const queryClient = new QueryClient({
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
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      staleTime: 30000,
    },
  },
});