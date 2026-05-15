import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../apiClient";

const isLocalReceiptUri = (uri?: string) => {
  if (!uri) return false;
  return uri.startsWith("file://") || uri.startsWith("content://") || uri.startsWith("ph://") || uri.startsWith("asset://");
};

const buildTransactionRequestBody = (tx: any) => {
  const localReceipt = isLocalReceiptUri(tx?.receipt);
  if (!localReceipt) return tx;

  const form = new FormData();
  Object.entries(tx || {}).forEach(([key, value]) => {
    if (key === "receipt") return;
    if (value === undefined || value === null) return;
    form.append(key, String(value));
  });

  const fileName = tx.receipt.split("/").pop() || `receipt-${Date.now()}.jpg`;
  form.append("receiptFile", {
    uri: tx.receipt,
    name: fileName,
    type: "image/jpeg",
  } as any);

  return form;
};

const getTransactionRequestConfig = (body: any) => {
  if (body instanceof FormData) {
    return { headers: { "Content-Type": "multipart/form-data" } };
  }
  return undefined;
};

/**
 * ======================== DASHBOARD & ANALYTICS ========================
 */

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response: any = await apiClient.get("/transaction/stats");
      return response || {};
    },
  });
};

export const useInsights = () => {
  return useQuery({
    queryKey: ["insights"],
    queryFn: async () => {
      const response: any = await apiClient.get("/transaction/insights");
      return response || {};
    },
  });
};

/**
 * ======================== TRANSACTIONS ========================
 */

export const useTransactions = (filters: any = {}) => {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: async () => {
      const response: any = await apiClient.get("/transaction", { params: filters });
      return (response?.transactions || []).map((tx: any) => ({
        ...tx,
        id: tx.id || tx._id,
      }));
    },
  });
};

export const useAddTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tx: any) => {
      const body = buildTransactionRequestBody(tx);
      return apiClient.post("/transaction", body, getTransactionRequestConfig(body));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
    meta: {
      successMessage: "Transaction recorded in your live vault.",
      errorMessage: "Could not synchronize transaction with server."
    }
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tx: any) => {
      const body = buildTransactionRequestBody(tx);
      const transactionId = tx.id || tx._id;
      if (!transactionId) {
        throw new Error("Transaction id is missing.");
      }
      return apiClient.put(`/transaction/${transactionId}`, body, getTransactionRequestConfig(body));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
    meta: {
      successMessage: "Transaction details synchronized.",
      errorMessage: "Failed to update transaction on server."
    }
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/transaction/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
    meta: {
      successMessage: "Transaction permanently removed.",
      errorMessage: "Failed to remove transaction from live server."
    }
  });
};

/**
 * ======================== GOALS (VAULT OBJECTIVES) ========================
 */

export const useGoals = () => {
  return useQuery({
    queryKey: ["goals"],
    queryFn: async () => {
      const response: any = await apiClient.get("/goal");
      return response || [];
    },
  });
};

export const useUpsertGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (goal: any) => {
      if (goal.id || goal._id) {
        const id = goal.id || goal._id;
        return apiClient.put(`/goal/${id}`, goal);
      }
      return apiClient.post("/goal", goal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
    meta: {
      successMessage: "Vault objective synchronized successfully.",
      errorMessage: "Goal synchronization failed."
    }
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/goal/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
    meta: {
      successMessage: "Vault objective removed.",
      errorMessage: "Failed to remove objective from server."
    }
  });
};
