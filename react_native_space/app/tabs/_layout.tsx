import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { COLORS } from '@/src/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const insets = useSafeAreaInsets();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Redirect href="/auth/login" />;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.surfaceBorder,
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    >
      <Tabs.Screen name="dashboard" options={{
        title: 'Özet',
        tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color} />,
      }} />
      <Tabs.Screen name="stock" options={{
        title: 'Stok',
        tabBarIcon: ({ color, size }) => <Ionicons name="cube" size={size} color={color} />,
      }} />
      <Tabs.Screen name="dispatch" options={{
        title: 'Sevkiyat',
        tabBarIcon: ({ color, size }) => <Ionicons name="car" size={size} color={color} />,
      }} />
      <Tabs.Screen name="revenue" options={{
        title: 'Ciro',
        tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" size={size} color={color} />,
      }} />
      <Tabs.Screen name="more" options={{
        title: 'Diğer',
        tabBarIcon: ({ color, size }) => <Ionicons name="menu" size={size} color={color} />,
      }} />
    </Tabs>
  );
}
