// import { MMKV } from 'react-native-mmkv';

// export const storage = new MMKV();

// utils/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  set: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error("Error saving data", e);
    }
  },

  get: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.error("Error retrieving data", e);
      return null;
    }
  },

  remove: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error("Error removing data", e);
    }
  },

  clear: async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error("Error clearing data", e);
    }
  }
};
