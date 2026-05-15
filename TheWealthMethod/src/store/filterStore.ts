import { create } from 'zustand';

interface FilterState {
  selectedType: 'all' | 'income' | 'expense';
  selectedCategory: string | null;
  dateRange: {
    start: string | null;
    end: string | null;
  };
  setFilter: (filters: Partial<Omit<FilterState, 'setFilter' | 'reset'>>) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedType: 'all',
  selectedCategory: null,
  dateRange: {
    start: null,
    end: null,
  },
  setFilter: (filters) => set((state) => ({ ...state, ...filters })),
  reset: () => set({
    selectedType: 'all',
    selectedCategory: null,
    dateRange: { start: null, end: null }
  }),
}));
