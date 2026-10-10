import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useWarehouseControllerGetStock } from '@/src/api/generated/api';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { getBaseUnitLabel } from '@/src/utils/format';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '@/src/components/EmptyState';

export default function StockScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [belowOnly, setBelowOnly] = useState(false);
  const stock = useWarehouseControllerGetStock({ search: search || undefined, belowThreshold: belowOnly || undefined });

  useFocusEffect(useCallback(() => { stock.refetch(); }, []));

  const items = stock.data?.items ?? [];

  return (
    <View style={s.container}>
      <TextInput
        style={s.search}
        placeholder="Ürün ara..."
        placeholderTextColor={COLORS.textMuted}
        value={search}
        onChangeText={setSearch}
      />
      <View style={s.chips}>
        <Pressable style={[s.chip, !belowOnly && s.chipActive]} onPress={() => setBelowOnly(false)}>
          <Text style={[s.chipText, !belowOnly && s.chipTextActive]}>Tümü</Text>
        </Pressable>
        <Pressable style={[s.chip, belowOnly && s.chipActive]} onPress={() => setBelowOnly(true)}>
          <Text style={[s.chipText, belowOnly && s.chipTextActive]}>Düşük Stok</Text>
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.productId}
        refreshControl={<RefreshControl refreshing={stock.isLoading} onRefresh={() => stock.refetch()} tintColor={COLORS.accent} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={<EmptyState message="Ürün bulunamadı" />}
        renderItem={({ item }) => (
          <Pressable style={s.row} onPress={() => router.push(`/product/${item.productId}`)}>
            <View style={s.rowLeft}>
              <Text style={s.name}>{item.productName}</Text>
              <Text style={s.cat}>{item.category}</Text>
              {!item.hasInitialStock && <Text style={s.warn}>Başlangıç stoğu girilmedi</Text>}
            </View>
            <View style={s.rowRight}>
              <Text style={[s.stock, item.isBelowThreshold && { color: COLORS.warning }]}>
                {item.currentStock} {getBaseUnitLabel(item.baseUnit)}
              </Text>
            </View>
          </Pressable>
        )}
      />

      <Pressable style={s.fab} onPress={() => router.push('/product/new')}>
        <Ionicons name="add" size={28} color={COLORS.white} />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  search: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder,
    borderRadius: RADIUS.md, color: COLORS.text, fontSize: 15, padding: SPACING.md,
    margin: SPACING.md, height: 48,
  },
  chips: { flexDirection: 'row', paddingHorizontal: SPACING.md, gap: SPACING.sm, marginBottom: SPACING.sm },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textSecondary, fontSize: 13 },
  chipTextActive: { color: COLORS.white },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderBottomWidth: 0.5, borderBottomColor: COLORS.surfaceBorder },
  rowLeft: { flex: 1 },
  rowRight: { alignItems: 'flex-end' },
  name: { color: COLORS.text, fontSize: 16, fontWeight: '600' },
  cat: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  warn: { color: COLORS.warning, fontSize: 11, marginTop: 2 },
  stock: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', elevation: 4 },
});
