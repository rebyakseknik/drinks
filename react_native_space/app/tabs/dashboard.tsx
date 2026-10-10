import React, { useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  useClosingsControllerToday,
  useClosingsControllerSummary,
  useClosingsControllerComparison,
  useWarehouseControllerGetStock,
  useMovementsControllerFindAll,
} from '@/src/api/generated/api';
import type { ClosingResponseDto } from '@/src/api/generated/schemas';
import { Card } from '@/src/components/Card';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { formatMoney, getMovementTypeLabel, istanbulToday, formatDateTime } from '@/src/utils/format';
import { formatStock } from '@/src/utils/quantity';

function QuickAction({ icon, label, onPress, color }: { icon: string; label: string; onPress: () => void; color: string }) {
  return (
    <Pressable
      style={({ pressed }) => [s.action, { borderColor: color }, pressed && { opacity: 0.8 }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[s.actionIcon, { backgroundColor: color + '26' }]}>
        <Ionicons name={icon as never} size={26} color={color} />
      </View>
      <Text style={s.actionLabel}>{label}</Text>
    </Pressable>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const today = useClosingsControllerToday();
  const summary = useClosingsControllerSummary();
  const comparison = useClosingsControllerComparison();
  const stock = useWarehouseControllerGetStock({});
  const recent = useMovementsControllerFindAll({ status: 'active', limit: 6 });

  const refreshAll = useCallback(() => {
    today.refetch();
    summary.refetch();
    comparison.refetch();
    stock.refetch();
    recent.refetch();
  }, []);
  useFocusEffect(useCallback(() => { refreshAll(); }, []));

  const todayClosing = (today.data?.closing ?? null) as ClosingResponseDto | null;
  const comp = comparison.data;
  const items = stock.data?.items ?? [];
  const critical = useMemo(() => items.filter((i) => i.isBelowThreshold), [items]);
  const uncounted = useMemo(() => items.filter((i) => !i.hasInitialStock), [items]);
  const dayOfMonth = Number(istanbulToday().slice(8, 10));

  const openCiro = () => (todayClosing ? router.push(`/closing/${todayClosing.id}`) : router.push('/closing/new'));

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      refreshControl={<RefreshControl refreshing={today.isLoading} onRefresh={refreshAll} tintColor={COLORS.accent} />}
    >
      {/* Hızlı işlemler */}
      <View style={s.actions}>
        <QuickAction icon="cube" label="Mal Geldi" color={COLORS.success} onPress={() => router.push('/movement/new?type=mal_kabul')} />
        <QuickAction icon="car" label="Sevkiyat Yap" color={COLORS.accent} onPress={() => router.push('/movement/new?type=sevkiyat')} />
        <QuickAction icon="cash" label="Ciro Gir" color={COLORS.primaryLight} onPress={openCiro} />
      </View>

      {/* Ciro */}
      <Card>
        <Pressable onPress={openCiro}>
          <Text style={s.label}>Bugünkü ciro</Text>
          {todayClosing ? (
            <>
              <Text style={s.bigMoney}>{formatMoney(todayClosing.totalRevenueKurus)}</Text>
              <Text style={s.sub}>
                Nakit {formatMoney(todayClosing.netCashKurus)} · Kart {formatMoney(todayClosing.netCardKurus)}
              </Text>
              {todayClosing.totalRevenueKurus === 0 && <Text style={s.note}>Sıfır ciro olarak kaydedildi</Text>}
            </>
          ) : (
            <Text style={s.missing}>Kapanış girilmedi</Text>
          )}
          {comp?.today && comp?.lastWeek && comp.changePercent != null && (
            <Text style={[s.sub, { marginTop: SPACING.xs }]}>
              Geçen hafta aynı gün {formatMoney(comp.lastWeek.totalRevenueKurus)}{' '}
              <Text style={{ color: comp.changePercent >= 0 ? COLORS.success : COLORS.error, fontWeight: '700' }}>
                {comp.changePercent >= 0 ? '↑' : '↓'} %{Math.abs(comp.changePercent).toFixed(1)}
              </Text>
            </Text>
          )}
        </Pressable>

        <View style={s.divider} />

        <Pressable onPress={() => router.push('/tabs/revenue')}>
          <Text style={s.label}>Bu ay</Text>
          {summary.data && summary.data.daysRecorded > 0 ? (
            <>
              <Text style={s.midMoney}>{formatMoney(summary.data.totalRevenueKurus)}</Text>
              <Text style={s.sub}>
                {summary.data.daysRecorded} gün kaydedildi · bugüne kadar {dayOfMonth} gün
              </Text>
            </>
          ) : (
            <Text style={s.missing}>Bu ay henüz ciro kaydı yok</Text>
          )}
        </Pressable>
      </Card>

      {/* Kritik stok */}
      <Card>
        <View style={s.cardHead}>
          <Text style={s.label}>Kritik stoklar</Text>
          <Pressable onPress={() => router.push('/tabs/stock')} hitSlop={10}>
            <Text style={s.link}>Tümü</Text>
          </Pressable>
        </View>
        {critical.map((item) => (
          <Pressable key={item.productId} style={s.listRow} onPress={() => router.push(`/product/${item.productId}`)}>
            <Text style={s.rowName} numberOfLines={1}>{item.productName}</Text>
            <Text style={s.rowWarn}>
              {formatStock(item.currentStock, item.baseUnit, item.packageFactor ? { name: item.packageName!, factor: item.packageFactor } : null)}
            </Text>
          </Pressable>
        ))}
        {critical.length === 0 && items.length > 0 && (
          <Text style={s.ok}>
            {uncounted.length > 0 ? 'Sayımı yapılan ürünlerde kritik stok yok' : 'Tüm ürünler eşiğin üstünde'}
          </Text>
        )}
        {items.length === 0 && !stock.isLoading && <Text style={s.missing}>Henüz ürün yok</Text>}
        {uncounted.length > 0 && (
          <Pressable style={s.uncounted} onPress={() => router.push('/tabs/stock')}>
            <Ionicons name="alert-circle" size={20} color={COLORS.warning} />
            <Text style={s.uncountedText}>
              {uncounted.length} ürünün başlangıç sayımı yok: {uncounted.slice(0, 3).map((u) => u.productName).join(', ')}
              {uncounted.length > 3 ? '…' : ''}
            </Text>
          </Pressable>
        )}
      </Card>

      {/* Son hareketler */}
      <Card>
        <View style={s.cardHead}>
          <Text style={s.label}>Son hareketler</Text>
          <Pressable onPress={() => router.push('/movement/history')} hitSlop={10}>
            <Text style={s.link}>Tümü</Text>
          </Pressable>
        </View>
        {(recent.data?.items ?? []).map((doc) => (
          <Pressable key={doc.id} style={s.listRow} onPress={() => router.push(`/movement/${doc.id}`)}>
            <View style={{ flex: 1 }}>
              <Text style={s.rowName} numberOfLines={1}>
                {(doc.lines ?? []).map((l) => l.productName).join(', ')}
              </Text>
              <Text style={s.rowSub}>{formatDateTime(doc.documentDate)}</Text>
            </View>
            <Text style={s.typeTag}>{getMovementTypeLabel(doc.type)}</Text>
          </Pressable>
        ))}
        {(recent.data?.items?.length ?? 0) === 0 && !recent.isLoading && <Text style={s.missing}>Henüz hareket yok</Text>}
      </Card>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  actions: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  action: {
    flex: 1,
    minHeight: 96,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  actionIcon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { color: COLORS.text, fontSize: 15, fontWeight: '700', textAlign: 'center' },
  label: { color: COLORS.textSecondary, fontSize: 15, fontWeight: '600', marginBottom: SPACING.xs },
  bigMoney: { color: COLORS.accent, fontSize: 30, fontWeight: '800' },
  midMoney: { color: COLORS.accent, fontSize: 24, fontWeight: '800' },
  sub: { color: COLORS.textSecondary, fontSize: 15 },
  note: { color: COLORS.textMuted, fontSize: 14, marginTop: 2 },
  missing: { color: COLORS.warning, fontSize: 16, fontStyle: 'italic' },
  divider: { height: 1, backgroundColor: COLORS.surfaceBorder, marginVertical: SPACING.md },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  link: { color: COLORS.accent, fontSize: 15, fontWeight: '600' },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    minHeight: 48,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorder,
    paddingVertical: SPACING.xs,
  },
  rowName: { color: COLORS.text, fontSize: 16, flexShrink: 1 },
  rowSub: { color: COLORS.textMuted, fontSize: 13 },
  rowWarn: { color: COLORS.warning, fontSize: 15, fontWeight: '700' },
  typeTag: { color: COLORS.primaryLight, fontSize: 13, fontWeight: '700' },
  ok: { color: COLORS.success, fontSize: 15 },
  uncounted: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.warning + '1A',
  },
  uncountedText: { color: COLORS.warning, fontSize: 14, flex: 1 },
});
