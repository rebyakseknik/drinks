import { Stack } from 'expo-router';
import { COLORS } from '@/src/utils/theme';

export default function StaffLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.text,
      headerTitleStyle: { fontWeight: '700' },
    }}>
      <Stack.Screen name="index" options={{ title: 'Personel' }} />
      <Stack.Screen name="form" options={{ title: 'Personel Bilgisi' }} />
    </Stack>
  );
}
