import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStaffControllerFindAll } from '@/src/api/generated/api';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { EmptyState } from '@/src/components/EmptyState';
import { Chip } from '@/src/components/Chip';
import { getErrorMessage } from '@/src/api/customFetch';
import { formatMoney } from '@/src/utils/format';
import { WAGE_PERIOD_LABELS } from '@/src/utils/team';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';

export default function StaffListScreen() {
  const router = useRouter();
  const [showInactive, setShowInactive] = useState(false);
  const { data, isLoading, isError, error, refetch, isRefetching } = useStaffControllerFindAll({ includeInactive: showInactive });
  const items = data?.items ?? [];

  if (isLoading) return <LoadingScreen />;

  return (
    <View style={s.container}>
      <View style={s.chips}>
        <Chip label="Çalışanlar" selected={!showInactive} onPress={() => setShowInactive(false)} />
        <Chip label="Ayrılanlar dahil" selected={showInactive} onPress={() => setShowInactive(true)} />
      </View>
      {isError ? (
        <Pressable onPress={() => refetch()}><Text style={s.error}>{getErrorMessage(error, 'Personel yüklenemedi')} — tekrar dene</Text></Pressable>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.accent} />}
          renderItem={({ item }) => (
            <Pressable style={[s.row, !item?.active && { opacity: 0.55 }]} onPress={() => router.push(`/staff/form?id=${item.id}`)} accessibilityLabel={item?.name ?? ''}>
              <View style={s.avatar}><Text style={s.avatarText}>{(item?.name ?? '?').slice(0, 1).toLocaleUpperCase('tr')}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{item?.name ?? ''}</Text>
                <Text style={s.sub}>
                  {item?.wageKurus != null ? `${WAGE_PERIOD_LABELS[item?.wagePeriod ?? ''] ?? ''} ${formatMoney(item.wageKurus)}` : 'Ücret girilmedi'}
                  {item?.phone ? ` · ${item.phone}` : ''}
                </Text>
              </View>
              {!item?.active && <Text style={s.badge}>Ayrıldı</Text>}
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </Pressable>
          )}
          ListEmptyComponent={<EmptyState message="Henüz personel yok. Sağ alttaki + ile ekleyin." icon="people-outline" />}
        />
      )}
      <Pressable style={s.fab} onPress={() => router.push('/staff/form')} accessibilityLabel="Yeni personel">
        <Ionicons name="person-add" size={24} color={COLORS.white} />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md, paddingBottom: 0 },
  chips: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 64, paddingVertical: SPACING.sm, borderBottomWidth: 0.5, borderBottomColor: COLORS.surfaceBorder, gap: SPACING.md },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: COLORS.accent, fontSize: 18, fontWeight: '800' },
  name: { color: COLORS.text, fontSize: 16, fontWeight: '600' },
  sub: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  badge: { color: COLORS.warning, fontSize: 13, fontWeight: '700' },
  error: { color: COLORS.error, fontSize: 15, padding: SPACING.md },
  fab: { position: 'absolute', right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', elevation: 4, borderWidth: 1, borderColor: COLORS.accent },
});
