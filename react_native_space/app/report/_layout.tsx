import { Stack } from 'expo-router';
import { COLORS } from '@/src/utils/theme';

export default function ReportLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.text,
      headerTitleStyle: { fontWeight: '700' },
    }}>
      <Stack.Screen name="revenue" options={{ title: 'Ciro Raporu' }} />
      <Stack.Screen name="dispatches" options={{ title: 'Sevkiyat Raporu' }} />
      <Stack.Screen name="top-dispatched" options={{ title: 'En Çok Sevk Edilen' }} />
      <Stack.Screen name="export" options={{ title: 'Dışa Aktar' }} />
    </Stack>
  );
}
