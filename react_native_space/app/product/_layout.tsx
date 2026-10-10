import { Stack } from 'expo-router';
import { COLORS } from '@/src/utils/theme';

export default function ProductLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: COLORS.background },
      headerTintColor: COLORS.text,
      headerTitleStyle: { fontWeight: '700' },
    }}>
      <Stack.Screen name="index" options={{ title: 'Ürünler' }} />
      <Stack.Screen name="new" options={{ title: 'Yeni Ürün' }} />
      <Stack.Screen name="[id]/index" options={{ title: 'Ürün Detay' }} />
      <Stack.Screen name="[id]/edit" options={{ title: 'Ürün Düzenle' }} />
      <Stack.Screen name="[id]/conversion" options={{ title: 'Dönüşüm Ekle' }} />
      <Stack.Screen name="[id]/initial-stock" options={{ title: 'Başlangıç Stoğu' }} />
    </Stack>
  );
}
