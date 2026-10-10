import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { COLORS } from '@/src/utils/theme';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated) return <Redirect href="/tabs/dashboard" />;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.background } }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
