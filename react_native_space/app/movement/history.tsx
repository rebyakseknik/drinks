import React, { useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useMovementsControllerFindAll } from '@/src/api/generated/api';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { getMovementTypeLabel, formatDateTime } from '@/src/utils/format';
import { EmptyState } from '@/src/components/EmptyState';

export default function MovementHistoryScreen() {
  const router = useRouter();
  const movements = useMovementsControllerFindAll({ limit: 100 });

  useFocusEffect(useCallback(() => { movements.refetch(); }, []));

  const items = movements.data?.items ?? [];

  return (
    <View style={s.container}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        refreshControl={<RefreshControl refreshing={movements.isLoading} onRefresh={() => movements.refetch()} tintColor={COLORS.accent} />}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={<EmptyState message="Henüz hareket kaydı yok" />}
        renderItem={({ item }) => (
          <Pressable style={s.row} onPress={() => router.push(`/movement/${item.id}`)}>
            <View style={s.left}>
              <Text style={s.date}>{formatDateTime(item.documentDate)}</Text>
              <Text style={s.type}>{getMovementTypeLabel(item.type)}</Text>
              <Text style={s.lineCount}>{item.lines?.length ?? 0} ürün</Text>
            </View>
            <View style={[s.badge, item.status === 'reversed' ? s.badgeRed : s.badgeGreen]}>
              <Text style={s.badgeText}>{item.reversalOfId ? 'İptal kaydı' : item.status === 'reversed' ? 'İptal edildi' : 'Aktif'}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderBottomWidth: 0.5, borderBottomColor: COLORS.surfaceBorder },
  left: { flex: 1 },
  date: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  type: { color: COLORS.primaryLight, fontSize: 13 },
  lineCount: { color: COLORS.textMuted, fontSize: 13 },
  badge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.sm },
  badgeGreen: { backgroundColor: COLORS.success + '30' },
  badgeRed: { backgroundColor: COLORS.error + '30' },
  badgeText: { color: COLORS.text, fontSize: 13, fontWeight: '600' },
});
