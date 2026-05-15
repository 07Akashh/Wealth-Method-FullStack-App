import { create } from 'zustand';

type BottomSheetType = 'add-transaction' | 'add-goal' | null;

interface BottomSheetState {
  isOpened: boolean;
  type: BottomSheetType;
  editData: any;
  open: (type: BottomSheetType, editData?: any) => void;
  close: () => void;
}

export const useBottomSheetStore = create<BottomSheetState>((set) => ({
  isOpened: false,
  type: null,
  editData: null,
  open: (type, editData = null) => set({ isOpened: true, type, editData }),
  close: () => set({ isOpened: false, type: null, editData: null }),
}));
