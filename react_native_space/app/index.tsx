import { Redirect } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { LoadingScreen } from '@/src/components/LoadingScreen';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated) return <Redirect href="/tabs/dashboard" />;
  return <Redirect href="/auth/login" />;
}
