import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { authControllerLogin, authControllerMe, authControllerSignup } from '@/src/api/generated/api';
import { getErrorMessage, setAuthToken, setUnauthorizedHandler } from '@/src/api/customFetch';
import { useQueryClient } from '@tanstack/react-query';
import type { UserInfoDto } from '@/src/api/generated/schemas';

let SecureStore: typeof import('expo-secure-store') | null = null;
if (Platform.OS !== 'web') {
  SecureStore = require('expo-secure-store');
}

const TOKEN_KEY = 'auth_token';

async function saveToken(token: string) {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } else {
    // Telefonda yalnızca şifreli depoda saklanır
    await SecureStore?.setItemAsync(TOKEN_KEY, token);
  }
  setAuthToken(token);
}

async function getToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(TOKEN_KEY);
  }
  return SecureStore?.getItemAsync(TOKEN_KEY) ?? null;
}

async function removeToken() {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore?.deleteItemAsync(TOKEN_KEY);
  }
  // Eski sürümün açık depoda bıraktığı kopyayı da temizle
  await AsyncStorage.removeItem(TOKEN_KEY).catch(() => {});
  setAuthToken(null);
}

interface AuthContextType {
  user: UserInfoDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, inviteCode?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfoDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (Platform.OS !== 'web') await AsyncStorage.removeItem(TOKEN_KEY).catch(() => {});
        const token = await getToken();
        setAuthToken(token);
        if (token) {
          const res = await authControllerMe();
          if (mounted) setUser(res?.user ?? null);
        }
      } catch {
        await removeToken();
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await authControllerLogin({ email, password });
      await saveToken(res.token);
      setUser(res.user);
    } catch (e) {
      throw new Error(getErrorMessage(e, 'Giriş başarısız'));
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, inviteCode?: string) => {
    try {
      const res = await authControllerSignup({ name, email, password, inviteCode });
      await saveToken(res.token);
      setUser(res.user);
    } catch (e) {
      throw new Error(getErrorMessage(e, 'Kayıt başarısız'));
    }
  }, []);

  const logout = useCallback(async () => {
    await removeToken();
    setUser(null);
    queryClient.clear(); // bir sonraki kullanıcı eski verileri görmesin
  }, [queryClient]);

  // Oturum sunucuda geçersizleşirse (kullanıcı silindi, süre doldu) giriş ekranına dön
  useEffect(() => {
    setUnauthorizedHandler(() => {
      void logout();
    });
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
