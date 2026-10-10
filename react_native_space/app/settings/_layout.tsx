import { Stack } from 'expo-router';
import { COLORS } from '@/src/utils/theme';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="business" options={{ title: 'İşletme Bilgileri' }} />
      <Stack.Screen name="users" options={{ title: 'Kullanıcılar' }} />
      <Stack.Screen name="invites" options={{ title: 'Davet Kodları' }} />
      <Stack.Screen name="change-password" options={{ title: 'Şifre Değiştir' }} />
      <Stack.Screen name="audit-log" options={{ title: 'İşlem Geçmişi' }} />
    </Stack>
  );
}
