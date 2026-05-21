import { create } from 'zustand';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  setAuth: (accessToken: string, refreshToken: string | null, user: any) => Promise<void>;
  setAccessToken: (accessToken: string) => Promise<void>;
  loadAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const storage = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  accessToken: null,
  refreshToken: null,
  user: null,
  setAuth: async (accessToken, refreshToken, user) => {
    try {
      await storage.setItem('accessToken', accessToken);
      await storage.setItem('token', accessToken);
      if (refreshToken) await storage.setItem('refreshToken', refreshToken);
      await storage.setItem('user', JSON.stringify(user));
      set({ token: accessToken, accessToken, refreshToken, user });
    } catch (e) {
      console.error('Failed to save auth:', e);
    }
  },
  setAccessToken: async (accessToken) => {
    try {
      await storage.setItem('accessToken', accessToken);
      await storage.setItem('token', accessToken);
      set({ token: accessToken, accessToken });
    } catch (e) {
      console.error('Failed to save access token:', e);
    }
  },
  loadAuth: async () => {
    try {
      const accessToken = await storage.getItem('accessToken');
      const legacyToken = await storage.getItem('token');
      const refreshToken = await storage.getItem('refreshToken');
      const userString = await storage.getItem('user');
      const token = accessToken || legacyToken;

      if (token && userString) {
        set({ token, accessToken: token, refreshToken, user: JSON.parse(userString) });
      }
    } catch (e) {
      console.error('Failed to load auth:', e);
    }
  },
  logout: async () => {
    try {
      await storage.removeItem('accessToken');
      await storage.removeItem('refreshToken');
      await storage.removeItem('token');
      await storage.removeItem('user');
      set({ token: null, accessToken: null, refreshToken: null, user: null });
    } catch (e) {
      console.error('Failed to logout:', e);
    }
  },
}));
