import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWarehouseControllerGetStock } from '@/src/api/generated/api';
import { COLORS, SPACING, RADIUS, TOUCH } from '@/src/utils/theme';
import { formatStock, formatBase } from '@/src/utils/quantity';
import { EmptyState } from '@/src/components/EmptyState';

type Filter = 'all' | 'critical' | 'uncounted';

export default function StockScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const stock = useWarehouseControllerGetStock({ search: search || undefined });

  useFocusEffect(useCallback(() => { stock.refetch(); }, []));

  const all = stock.data?.items ?? [];
  const counts = useMemo(
    () => ({ critical: all.filter((i) => i.isBelowThreshold).length, uncounted: all.filter((i) => !i.hasInitialStock).length }),
    [all],
  );
  const items = useMemo(
    () => all.filter((i) => (filter === 'critical' ? i.isBelowThreshold : filter === 'uncounted' ? !i.hasInitialStock : true)),
    [all, filter],
  );

  const Chip = ({ id, label }: { id: Filter; label: string }) => (
    <Pressable style={[s.chip, filter === id && s.chipActive]} onPress={() => setFilter(id)}>
      <Text style={[s.chipText, filter === id && s.chipTextActive]}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={s.container}>
      <TextInput
        style={s.search}
        placeholder="Ürün ara..."
        placeholderTextColor={COLORS.textMuted}
        value={search}
        onChangeText={setSearch}
        clearButtonMode="while-editing"
      />
      <View style={s.chips}>
        <Chip id="all" label="Tümü" />
        <Chip id="critical" label={`Kritik${counts.critical ? ` (${counts.critical})` : ''}`} />
        <Chip id="uncounted" label={`Sayımı eksik${counts.uncounted ? ` (${counts.uncounted})` : ''}`} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.productId}
        refreshControl={<RefreshControl refreshing={stock.isLoading} onRefresh={() => stock.refetch()} tintColor={COLORS.accent} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={<EmptyState message={filter === 'all' ? 'Ürün bulunamadı' : 'Bu filtrede ürün yok'} />}
        renderItem={({ item }) => {
          const pkg = item.packageFactor ? { name: item.packageName!, factor: item.packageFactor } : null;
          return (
            <Pressable style={s.row} onPress={() => router.push(`/product/${item.productId}`)}>
              <View style={s.rowLeft}>
                <Text style={s.name}>{item.productName}</Text>
                {item.hasInitialStock ? (
                  <Text style={s.cat}>
                    {item.category}
                    {item.minStockThreshold > 0 ? ` · eşik ${formatBase(item.minStockThreshold, item.baseUnit)}` : ''}
                  </Text>
                ) : (
                  <Text style={s.warn}>Başlangıç sayımı yok</Text>
                )}
              </View>
              {item.hasInitialStock ? (
                <Text style={[s.stock, item.isBelowThreshold && { color: COLORS.warning }]}>
                  {formatStock(item.currentStock, item.baseUnit, pkg)}
                </Text>
              ) : (
                <Text style={s.unknown}>—</Text>
              )}
            </Pressable>
          );
        }}
      />

      <Pressable style={s.fab} onPress={() => router.push('/product/new')} accessibilityLabel="Yeni ürün">
        <Ionicons name="add" size={28} color={COLORS.white} />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  search: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: RADIUS.md,
    color: COLORS.text,
    fontSize: 16,
    paddingHorizontal: SPACING.md,
    margin: SPACING.md,
    height: TOUCH,
  },
  chips: { flexDirection: 'row', paddingHorizontal: SPACING.md, gap: SPACING.sm, marginBottom: SPACING.sm },
  chip: {
    paddingHorizontal: SPACING.md,
    minHeight: 40,
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textSecondary, fontSize: 15 },
  chipTextActive: { color: COLORS.white, fontWeight: '600' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorder,
  },
  rowLeft: { flex: 1 },
  name: { color: COLORS.text, fontSize: 17, fontWeight: '600' },
  cat: { color: COLORS.textMuted, fontSize: 14, marginTop: 2 },
  warn: { color: COLORS.warning, fontSize: 14, marginTop: 2, fontWeight: '600' },
  stock: { color: COLORS.text, fontSize: 17, fontWeight: '700', textAlign: 'right', flexShrink: 1 },
  unknown: { color: COLORS.textMuted, fontSize: 20, fontWeight: '700' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
