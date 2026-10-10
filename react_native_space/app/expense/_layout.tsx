import { Stack } from 'expo-router';
import { COLORS } from '@/src/utils/theme';

export default function ExpenseLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.text,
      headerTitleStyle: { fontWeight: '700' },
    }}>
      <Stack.Screen name="index" options={{ title: 'Giderler' }} />
      <Stack.Screen name="form" options={{ title: 'Yeni Gider' }} />
    </Stack>
  );
}
