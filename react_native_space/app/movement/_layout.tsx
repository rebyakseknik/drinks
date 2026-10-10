import { Stack } from 'expo-router';
import { COLORS } from '@/src/utils/theme';

export default function MovementLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.text,
      headerTitleStyle: { fontWeight: '700' },
    }}>
      <Stack.Screen name="new" options={{ title: 'Yeni Hareket' }} />
      <Stack.Screen name="history" options={{ title: 'Stok Hareketleri' }} />
      <Stack.Screen name="[id]/index" options={{ title: 'Hareket Detay' }} />
    </Stack>
  );
}
