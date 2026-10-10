import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { Ionicons } from '@expo/vector-icons';

function MenuItem({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <Pressable style={s.menuItem} onPress={onPress}>
      <Ionicons name={icon as any} size={22} color={COLORS.textSecondary} />
      <Text style={s.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
    </Pressable>
  );
}

export default function MoreScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const isOwner = user?.role === 'owner';

  const handleLogout = () => {
    const doLogout = async () => { await logout(); };
    if (Platform.OS === 'web') {
      if (confirm('Çıkış yapmak istediğinize emin misiniz?')) doLogout();
    } else {
      Alert.alert('Çıkış', 'Çıkış yapmak istediğinize emin misiniz?', [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', style: 'destructive', onPress: doLogout },
      ]);
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.section}>ÜRÜN YÖNETİMİ</Text>
      <MenuItem icon="pricetags" label="Ürünler" onPress={() => router.push('/product/new')} />

      <Text style={s.section}>RAPORLAR</Text>
      <MenuItem icon="trending-up" label="Ciro Raporu" onPress={() => router.push('/report/revenue')} />
      <MenuItem icon="car" label="Sevkiyat Raporu" onPress={() => router.push('/report/dispatches')} />
      <MenuItem icon="podium" label="En Çok Sevk Edilen" onPress={() => router.push('/report/top-dispatched')} />
      <MenuItem icon="download" label="Dışa Aktar (CSV)" onPress={() => router.push('/report/export')} />

      <Text style={s.section}>DEPO İŞLEMLERİ</Text>
      <MenuItem icon="swap-horizontal" label="Stok Hareketleri" onPress={() => router.push('/movement/history')} />
      <MenuItem icon="add-circle" label="Yeni Hareket" onPress={() => router.push('/movement/new')} />

      <Text style={s.section}>İŞLETME</Text>
      <MenuItem icon="business" label="İşletme Bilgileri" onPress={() => router.push('/settings/business')} />

      {isOwner && (
        <>
          <Text style={s.section}>YÖNETİM</Text>
          <MenuItem icon="people" label="Kullanıcılar" onPress={() => router.push('/settings/users')} />
          <MenuItem icon="key" label="Davet Kodları" onPress={() => router.push('/settings/invites')} />
        </>
      )}

      <Text style={s.section}>DENETİM</Text>
      <MenuItem icon="time" label="İşlem Geçmişi" onPress={() => router.push('/settings/audit-log')} />

      <Text style={s.section}>HESAP</Text>
      <MenuItem icon="lock-closed" label="Şifre Değiştir" onPress={() => router.push('/settings/change-password')} />

      <Pressable style={s.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out" size={22} color={COLORS.error} />
        <Text style={s.logoutText}>Çıkış Yap</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  section: { color: COLORS.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginTop: SPACING.lg, marginBottom: SPACING.xs },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: COLORS.surfaceBorder, gap: SPACING.md },
  menuLabel: { flex: 1, color: COLORS.text, fontSize: 15 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.xl, gap: SPACING.sm, paddingVertical: SPACING.md },
  logoutText: { color: COLORS.error, fontSize: 16, fontWeight: '600' },
});
