import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/src/utils/theme';

export default function NotFound() {
  const router = useRouter();
  return (
    <View style={s.c}>
      <Text style={s.t}>Sayfa bulunamadı</Text>
      <Pressable onPress={() => router.replace('/')} style={s.b}>
        <Text style={s.bt}>Ana Sayfaya Dön</Text>
      </Pressable>
    </View>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  t: { color: COLORS.text, fontSize: 18, marginBottom: SPACING.lg },
  b: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderRadius: 12 },
  bt: { color: COLORS.white, fontWeight: '600' },
});
