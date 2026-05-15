import { create } from 'zustand';

export type TransactionType = 'expense' | 'income';

interface ReceiptCaptureState {
    isOpen: boolean;
    transactionType: TransactionType;
    receiptImage: string | null;
    open: (type: TransactionType) => void;
    close: () => void;
    setTransactionType: (type: TransactionType) => void;
    setReceiptImage: (uri: string) => void;
    clearReceiptImage: () => void;
}

export const useReceiptCaptureStore = create<ReceiptCaptureState>((set) => ({
    isOpen: false,
    transactionType: 'expense',
    receiptImage: null,
    open: (type: TransactionType) => set({ isOpen: true, transactionType: type, receiptImage: null }),
    close: () => set({ isOpen: false, transactionType: 'expense', receiptImage: null }),
    setTransactionType: (type: TransactionType) => set({ transactionType: type }),
    setReceiptImage: (uri: string) => set({ receiptImage: uri }),
    clearReceiptImage: () => set({ receiptImage: null }),
}));
