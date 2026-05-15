import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

interface UserState {
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  currency: string;
  currencySymbol: string;
  monthlyLimit: number;
  biometricsEnabled: boolean;
  privacyEnabled: boolean;
  isAppLocked: boolean;
  hasHydrated: boolean;
  pin: string;
  pinEnabled: boolean;
  wipeDataEnabled: boolean;
  exchangeRates: Record<string, number>;
  updateProfile: (data: Partial<Omit<UserState, 'updateProfile' | 'setAppLocked' | 'hasHydrated' | 'convertAmount' | 'fetchExchangeRates'>>) => Promise<void>;
  setAppLocked: (locked: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
  convertAmount: (amountInINR: number) => number;
  fetchExchangeRates: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      name: 'Rahul',
      email: 'rahul@example.com',
      phone: '+1 234 567 890',
      avatar: null,
      currency: 'INR',
      currencySymbol: '₹',
      monthlyLimit: 500000,
      biometricsEnabled: false,
      privacyEnabled: true,
      isAppLocked: false,
      hasHydrated: false,
      pin: '',
      pinEnabled: false,
      wipeDataEnabled: false,
      exchangeRates: { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.009, JPY: 1.83, AUD: 0.018 },
      
      updateProfile: async (data) => {
        // Optimistically update local state
        set((state) => {
          const newState = { ...state, ...data };
          if (data.currency) {
            const found = CURRENCIES.find(c => c.code === data.currency);
            if (found) newState.currencySymbol = found.symbol;
          }
          return newState;
        });
        
        if (data.currency) {
          await get().fetchExchangeRates();
        }

        // Push updates to backend
        try {
          // Map local state keys to backend keys where necessary
          const backendData: any = { ...data };
          if (data.avatar !== undefined) backendData.img = data.avatar;
          if (data.currency !== undefined) backendData.preferredCurrency = data.currency;
          if (data.biometricsEnabled !== undefined) backendData.biometricEnabled = data.biometricsEnabled;
          if (data.privacyEnabled !== undefined) backendData.privacyMode = data.privacyEnabled;

          await authService.updateProfile(backendData);
        } catch (error) {
          console.error("Failed to sync profile update to backend:", error);
          // In a real app we might revert the state if the update failed
        }
      },

      fetchExchangeRates: async () => {
        try {
          // Frankfurter API doesn't require a key and supports many currencies
          const response = await fetch('https://api.frankfurter.app/latest?from=INR');
          const data = await response.json();
          if (data && data.rates) {
            set({ exchangeRates: { ...data.rates, INR: 1 } });
          }
        } catch (error) {
          console.error("Failed to fetch live exchange rates:", error);
        }
      },

      setAppLocked: (locked) => set({ isAppLocked: locked }),
      setHasHydrated: (hydrated) => {
          set({ hasHydrated: hydrated });
          if (hydrated) {
            get().fetchExchangeRates();
          }
      },
      convertAmount: (amountInINR) => {
        const { currency, exchangeRates } = get();
        const rate = exchangeRates[currency] || 1;
        return amountInINR * rate;
      },
      fetchProfile: async () => {
        try {
          const profileData = await authService.getProfile();
          if (profileData) {
            set((state) => ({
              ...state,
              name: profileData.name || state.name,
              email: profileData.email || state.email,
              phone: profileData.phone || state.phone,
              avatar: profileData.img || state.avatar,
              currency: profileData.preferredCurrency || state.currency,
              biometricsEnabled: profileData.biometricEnabled ?? state.biometricsEnabled,
              privacyEnabled: profileData.privacyMode ?? state.privacyEnabled,
            }));
            
            if (profileData.preferredCurrency) {
               const found = CURRENCIES.find(c => c.code === profileData.preferredCurrency);
               if (found) set({ currencySymbol: found.symbol });
               await get().fetchExchangeRates();
            }
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
      partialize: (state) => ({
          ...state,
          isAppLocked: (state.biometricsEnabled || state.pinEnabled) ? true : state.isAppLocked,
          hasHydrated: false, // Don't persist hydration status
      })
    }
  )
);

