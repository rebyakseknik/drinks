import { Stack } from 'expo-router';
import { COLORS } from '@/src/utils/theme';

export default function ShiftLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.text,
      headerTitleStyle: { fontWeight: '700' },
    }}>
      <Stack.Screen name="index" options={{ title: 'Vardiyalar' }} />
      <Stack.Screen name="form" options={{ title: 'Vardiya' }} />
      <Stack.Screen name="templates" options={{ title: 'Hazır Saatler' }} />
    </Stack>
  );
}
