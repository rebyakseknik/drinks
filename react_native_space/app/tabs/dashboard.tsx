import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useClosingsControllerToday, useClosingsControllerSummary, useClosingsControllerComparison, useWarehouseControllerGetStock, useMovementsControllerFindAll } from '@/src/api/generated/api';
import { Card } from '@/src/components/Card';
import { COLORS, SPACING } from '@/src/utils/theme';
import { formatMoney, getMovementTypeLabel } from '@/src/utils/format';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function DashboardScreen() {
  const router = useRouter();
  const today = useClosingsControllerToday();
  const summary = useClosingsControllerSummary();
  const comparison = useClosingsControllerComparison();
  const lowStock = useWarehouseControllerGetStock({ belowThreshold: true });
  const recentDispatches = useMovementsControllerFindAll({ type: 'sevkiyat', limit: 5 });

  const refreshAll = useCallback(() => {
    today.refetch();
    summary.refetch();
    comparison.refetch();
    lowStock.refetch();
    recentDispatches.refetch();
  }, []);

  useFocusEffect(useCallback(() => { refreshAll(); }, []));

  const isRefreshing = today.isLoading || summary.isLoading;
  const todayClosing = (today.data?.closing as any) ?? null;
  const comp = comparison.data;

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshAll} tintColor={COLORS.accent} />}
    >
      {/* Bugünkü Ciro */}
      <Pressable onPress={() => todayClosing ? router.push(`/closing/${todayClosing.id}`) : router.push('/closing/new')}>
        <Card>
          <Text style={s.label}>Bugünkü Ciro</Text>
          {todayClosing ? (
            <>
              <Text style={s.bigMoney}>{formatMoney(todayClosing.totalRevenueKurus)}</Text>
              <View style={s.row}>
                <Text style={s.sub}>Nakit: {formatMoney(todayClosing.netCashKurus)}</Text>
                <Text style={s.sub}>Kart: {formatMoney(todayClosing.netCardKurus)}</Text>
              </View>
            </>
          ) : (
            <Text style={s.placeholder}>Kapanış girilmedi</Text>
          )}
        </Card>
      </Pressable>

      {/* Geçen Hafta Karşılaştırma */}
      <Card>
        <Text style={s.label}>Geçen Hafta Karşılaştırma</Text>
        {comp?.today && comp?.lastWeek ? (
          <View style={s.row}>
            <Text style={s.sub}>Bugün: {formatMoney(comp.today.totalRevenueKurus as any)}</Text>
            <Text style={s.sub}>Geçen hafta: {formatMoney(comp.lastWeek.totalRevenueKurus as any)}</Text>
            {comp.changePercent != null && (
              <Text style={[s.change, { color: comp.changePercent >= 0 ? COLORS.success : COLORS.error }]}>
                {comp.changePercent >= 0 ? '↑' : '↓'} %{Math.abs(comp.changePercent).toFixed(1)}
              </Text>
            )}
          </View>
        ) : (
          <Text style={s.placeholder}>Karşılaştırma verisi yok</Text>
        )}
      </Card>

      {/* Aylık Ciro */}
      <Card>
        <Text style={s.label}>Aylık Ciro</Text>
        {summary.data ? (
          <>
            <Text style={s.bigMoney}>{formatMoney(summary.data.totalRevenueKurus)}</Text>
            <View style={s.row}>
              <Text style={s.sub}>Nakit: {formatMoney(summary.data.totalCashKurus)}</Text>
              <Text style={s.sub}>Kart: {formatMoney(summary.data.totalCardKurus)}</Text>
            </View>
            <Text style={s.sub}>{summary.data.daysRecorded} / {summary.data.daysInPeriod} gün</Text>
          </>
        ) : null}
      </Card>

      {/* Düşük Stok Uyarıları */}
      <Card>
        <Text style={s.label}>
          <Ionicons name="warning" size={16} color={COLORS.warning} /> Düşük Stok Uyarıları
        </Text>
        {(lowStock.data?.items?.length ?? 0) > 0 ? (
          (lowStock.data?.items ?? []).map((item) => (
            <View key={item.productId} style={s.alertRow}>
              <Text style={s.alertName}>{item.productName}</Text>
              <Text style={[s.alertStock, { color: COLORS.warning }]}>
                {item.currentStock} / {item.minStockThreshold}
              </Text>
            </View>
          ))
        ) : (
          <Text style={s.placeholderGreen}>Tüm stoklar yeterli</Text>
        )}
      </Card>

      {/* Son Sevkiyatlar */}
      <Card>
        <Text style={s.label}>Son Sevkiyatlar</Text>
        {(recentDispatches.data?.items?.length ?? 0) > 0 ? (
          (recentDispatches.data?.items ?? []).map((doc) => (
            <Pressable key={doc.id} style={s.dispatchRow} onPress={() => router.push(`/movement/${doc.id}`)}>
              <Text style={s.sub}>{new Date(doc.documentDate).toLocaleDateString('tr-TR')}</Text>
              <Text style={s.sub}>{doc.lines?.length ?? 0} ürün</Text>
            </Pressable>
          ))
        ) : (
          <Text style={s.placeholder}>Henüz sevkiyat kaydı yok</Text>
        )}
      </Card>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  label: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600', marginBottom: SPACING.sm },
  bigMoney: { color: COLORS.accent, fontSize: 28, fontWeight: '800' },
  row: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.xs, flexWrap: 'wrap' },
  sub: { color: COLORS.textSecondary, fontSize: 13 },
  placeholder: { color: COLORS.textMuted, fontSize: 15, fontStyle: 'italic' },
  placeholderGreen: { color: COLORS.success, fontSize: 14 },
  change: { fontSize: 15, fontWeight: '700' },
  alertRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.xs },
  alertName: { color: COLORS.text, fontSize: 14 },
  alertStock: { fontSize: 14, fontWeight: '600' },
  dispatchRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.xs, borderBottomWidth: 0.5, borderBottomColor: COLORS.surfaceBorder },
});
