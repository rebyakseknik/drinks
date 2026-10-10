import React from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { StatusBar } from 'react-native';
import { COLORS } from '@/src/utils/theme';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }}>
            <Stack.Screen name="auth" />
            <Stack.Screen name="tabs" />
            <Stack.Screen name="product" options={{ headerShown: false }} />
            <Stack.Screen name="movement" options={{ headerShown: false }} />
            <Stack.Screen name="closing" options={{ headerShown: false }} />
            <Stack.Screen name="report" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
          </Stack>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
