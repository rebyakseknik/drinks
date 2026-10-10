import React, { useCallback } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useProductsControllerFindOne, useWarehouseControllerGetStock } from '@/src/api/generated/api';
import { Card } from '@/src/components/Card';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { getBaseUnitLabel, formatDate } from '@/src/utils/format';
import { Ionicons } from '@expo/vector-icons';

export default function ProductDetailScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const product = useProductsControllerFindOne(id, { query: { enabled: !!id } });
  const stock = useWarehouseControllerGetStock({ search: undefined });

  useFocusEffect(useCallback(() => { product.refetch(); stock.refetch(); }, []));

  if (product.isLoading) return <LoadingScreen />;
  const p = product.data;
  if (!p) return <Text style={{ color: COLORS.error, padding: SPACING.md }}>Ürün bulunamadı</Text>;

  const initialStock = p.initialStock as { count: number; date: string } | null;
  const stockItem = (stock.data?.items ?? []).find((s) => s.productId === id);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} refreshControl={<RefreshControl refreshing={product.isLoading} onRefresh={() => product.refetch()} tintColor={COLORS.accent} />}>
      <Card>
        <Text style={s.name}>{p.name}</Text>
        <Text style={s.cat}>{p.category}</Text>
        <View style={s.row}>
          <Text style={s.info}>Birim: {getBaseUnitLabel(p.baseUnit)}</Text>
          <Text style={s.info}>Durum: {p.active ? 'Aktif' : 'Pasif'}</Text>
        </View>
        <Text style={s.info}>Min. Stok Eşiği: {p.minStockThreshold}</Text>
        <Pressable style={s.editBtn} onPress={() => router.push(`/product/${id}/edit`)}>
          <Text style={s.editBtnText}>Düzenle</Text>
        </Pressable>
      </Card>

      <Card>
        <Text style={s.sectionTitle}>Stok Özeti</Text>
        {stockItem ? (
          <Text style={s.stockValue}>{stockItem.currentStock} {getBaseUnitLabel(p.baseUnit)}</Text>
        ) : (
          <Text style={s.muted}>Hesaplanamadı</Text>
        )}
      </Card>

      <Card>
        <Text style={s.sectionTitle}>Başlangıç Stoğu</Text>
        {initialStock ? (
          <Text style={s.info}>{initialStock.count} {getBaseUnitLabel(p.baseUnit)} - {formatDate(initialStock.date)}</Text>
        ) : (
          <>
            <Text style={s.muted}>Girilmedi</Text>
            <Pressable style={s.actionBtn} onPress={() => router.push(`/product/${id}/initial-stock`)}>
              <Text style={s.actionBtnText}>Gir</Text>
            </Pressable>
          </>
        )}
      </Card>

      <Card>
        <View style={s.rowBetween}>
          <Text style={s.sectionTitle}>Paket Dönüşümleri</Text>
          <Pressable onPress={() => router.push(`/product/${id}/conversion`)}>
            <Ionicons name="add-circle" size={24} color={COLORS.accent} />
          </Pressable>
        </View>
        {(p.conversions?.length ?? 0) > 0 ? (
          (p.conversions ?? []).map((c) => (
            <View key={c.id} style={s.convRow}>
              <Text style={s.info}>1 {c.packageName} = {c.conversionFactor} {getBaseUnitLabel(p.baseUnit)}</Text>
              <Text style={s.muted}>{formatDate(c.effectiveFrom)}</Text>
            </View>
          ))
        ) : (
          <Text style={s.muted}>Henüz dönüşüm eklenmedi</Text>
        )}
      </Card>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  name: { color: COLORS.text, fontSize: 22, fontWeight: '700' },
  cat: { color: COLORS.accent, fontSize: 14, marginTop: 2 },
  row: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.sm },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  info: { color: COLORS.textSecondary, fontSize: 14 },
  muted: { color: COLORS.textMuted, fontSize: 14, fontStyle: 'italic' },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '600', marginBottom: SPACING.sm },
  stockValue: { color: COLORS.accent, fontSize: 24, fontWeight: '800' },
  editBtn: { marginTop: SPACING.md, backgroundColor: COLORS.primary, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, borderRadius: RADIUS.sm, alignSelf: 'flex-start' },
  editBtnText: { color: COLORS.white, fontWeight: '600' },
  actionBtn: { marginTop: SPACING.sm, backgroundColor: COLORS.accent, paddingVertical: SPACING.xs, paddingHorizontal: SPACING.md, borderRadius: RADIUS.sm, alignSelf: 'flex-start' },
  actionBtnText: { color: COLORS.background, fontWeight: '600' },
  convRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.xs, borderBottomWidth: 0.5, borderBottomColor: COLORS.surfaceBorder },
});
