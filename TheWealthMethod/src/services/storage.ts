import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  AUTH: "thewealthmethod.auth.v1",
  ACCESS_TOKEN: "thewealthmethod.token.v1",
} as const;

export const storage = {
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error("Error setting item in storage", error);
    }
  },
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error("Error getting item from storage", error);
      return null;
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing item from storage", error);
    }
  },
  clear: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing storage", error);
    }
  },
};
