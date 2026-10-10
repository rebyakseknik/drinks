import React, { useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useMovementsControllerFindAll } from '@/src/api/generated/api';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { formatDate } from '@/src/utils/format';
import { EmptyState } from '@/src/components/EmptyState';
import { GradientButton } from '@/src/components/GradientButton';

export default function DispatchScreen() {
  const router = useRouter();
  const dispatches = useMovementsControllerFindAll({ type: 'sevkiyat', limit: 50 });

  useFocusEffect(useCallback(() => { dispatches.refetch(); }, []));

  const items = dispatches.data?.items ?? [];

  return (
    <View style={s.container}>
      <View style={s.topBar}>
        <GradientButton title="Yeni Sevkiyat" onPress={() => router.push('/movement/new?type=sevkiyat')} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        refreshControl={<RefreshControl refreshing={dispatches.isLoading} onRefresh={() => dispatches.refetch()} tintColor={COLORS.accent} />}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={<EmptyState message="Henüz sevkiyat kaydı yok" icon="car-outline" />}
        renderItem={({ item }) => (
          <Pressable style={s.row} onPress={() => router.push(`/movement/${item.id}`)}>
            <View>
              <Text style={s.date}>{formatDate(item.documentDate)}</Text>
              <Text style={s.lineCount}>{item.lines?.length ?? 0} ürün</Text>
              <Text style={s.products} numberOfLines={1}>
                {(item.lines ?? []).slice(0, 3).map((l) => l.productName).join(', ')}
              </Text>
            </View>
            <View style={[s.badge, item.status === 'reversed' ? s.badgeRed : s.badgeGreen]}>
              <Text style={s.badgeText}>{item.status === 'reversed' ? 'İptal' : 'Aktif'}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topBar: { padding: SPACING.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderBottomWidth: 0.5, borderBottomColor: COLORS.surfaceBorder },
  date: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  lineCount: { color: COLORS.textSecondary, fontSize: 13 },
  products: { color: COLORS.textMuted, fontSize: 12, maxWidth: 220 },
  badge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: RADIUS.sm },
  badgeGreen: { backgroundColor: COLORS.success + '30' },
  badgeRed: { backgroundColor: COLORS.error + '30' },
  badgeText: { color: COLORS.text, fontSize: 11, fontWeight: '600' },
});
