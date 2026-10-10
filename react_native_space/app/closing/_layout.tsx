import { Stack } from 'expo-router';
import { COLORS } from '@/src/utils/theme';

export default function ClosingLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.text,
      headerTitleStyle: { fontWeight: '700' },
    }}>
      <Stack.Screen name="new" options={{ title: 'Yeni Kapanış' }} />
      <Stack.Screen name="[id]/index" options={{ title: 'Kapanış Detay' }} />
    </Stack>
  );
}
