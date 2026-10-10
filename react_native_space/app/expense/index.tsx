import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useExpensesControllerFindAll, useExpensesControllerSummary, useExpensesControllerRemove } from '@/src/api/generated/api';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { getErrorMessage } from '@/src/api/customFetch';
import { formatMoney, formatDate, getMonthName, istanbulToday } from '@/src/utils/format';
import { monthRange, EXPENSE_CATEGORY_LABELS, EXPENSE_CATEGORY_ICONS, confirmAction } from '@/src/utils/team';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';

export default function ExpenseListScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const today = istanbulToday();
  const [ym, setYm] = useState({ y: Number(today.slice(0, 4)), m: Number(today.slice(5, 7)) - 1 });
  const { from, to } = monthRange(ym.y, ym.m);
  const isThisMonth = today >= from && today <= to;

  const list = useExpensesControllerFindAll({ from, to });
  const summary = useExpensesControllerSummary({ from, to });
  const removeMut = useExpensesControllerRemove();
  const [deleteError, setDeleteError] = useState('');
  const items = list.data?.items ?? [];
  const sum = summary.data;

  const shiftMonth = (delta: number) => {
    const d = new Date(Date.UTC(ym.y, ym.m + delta, 1));
    setYm({ y: d.getUTCFullYear(), m: d.getUTCMonth() });
  };

  const refetchAll = () => { list.refetch(); summary.refetch(); };

  const handleDelete = (id: string, label: string) =>
    confirmAction('Gideri sil', `${label} silinsin mi?`, 'Sil', async () => {
      try {
        await removeMut.mutateAsync({ id });
        await queryClient.invalidateQueries();
      } catch (e) {
        setDeleteError(getErrorMessage(e, 'Silinemedi'));
      }
    });

  const net = sum?.netKurus ?? 0;
  const missingDays = Math.max(0, (sum?.daysInPeriod ?? 0) - (sum?.closingDays ?? 0));

  return (
    <View style={s.container}>
      <View style={s.monthBar}>
        <Pressable style={s.arrow} onPress={() => shiftMonth(-1)} accessibilityLabel="Önceki ay">
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </Pressable>
        <Pressable style={{ flex: 1, alignItems: 'center' }} onPress={() => setYm({ y: Number(today.slice(0, 4)), m: Number(today.slice(5, 7)) - 1 })} accessibilityLabel="Bu aya dön">
          <Text style={s.monthTitle}>{getMonthName(ym.m)} {ym.y}</Text>
          {!isThisMonth && <Text style={s.monthSub}>Bu aya dönmek için dokun</Text>}
        </Pressable>
        <Pressable style={s.arrow} onPress={() => shiftMonth(1)} accessibilityLabel="Sonraki ay">
          <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
        </Pressable>
      </View>

      {list.isLoading || summary.isLoading ? (
        <LoadingScreen />
      ) : list.isError || summary.isError ? (
        <Pressable onPress={refetchAll}><Text style={s.error}>{getErrorMessage(list.error ?? summary.error, 'Giderler yüklenemedi')} — tekrar dene</Text></Pressable>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={list.isRefetching || summary.isRefetching} onRefresh={refetchAll} tintColor={COLORS.accent} />}
        >
          <View style={s.card}>
            <View style={s.sumRow}>
              <Text style={s.sumLabel}>Ciro</Text>
              <Text style={s.sumVal}>{formatMoney(sum?.revenueKurus)}</Text>
            </View>
            <View style={s.sumRow}>
              <Text style={s.sumLabel}>Gider</Text>
              <Text style={[s.sumVal, { color: COLORS.error }]}>− {formatMoney(sum?.totalExpenseKurus)}</Text>
            </View>
            <View style={[s.sumRow, s.netRow]}>
              <Text style={s.netLabel}>Kalan</Text>
              <Text style={[s.netVal, { color: net < 0 ? COLORS.error : COLORS.success }]}>{net < 0 ? '− ' : ''}{formatMoney(Math.abs(net))}</Text>
            </View>
            {missingDays > 0 && (
              <Text style={s.hint}>Ciro {sum?.closingDays ?? 0} günlük kasa kapanışından. {missingDays} günün kapanışı yok.</Text>
            )}
            <Text style={s.hint}>
              Kalan = ciro − girilen giderler. Tedarikçiden alınan mallar gider olarak girilmediyse bu tutar kâr değildir.
            </Text>
          </View>

          {(sum?.byCategory ?? []).length > 0 && (
            <View style={s.catWrap}>
              {(sum?.byCategory ?? []).map((c) => (
                <View key={c.category} style={s.cat}>
                  <Ionicons name={(EXPENSE_CATEGORY_ICONS[c.category] ?? 'ellipse') as any} size={16} color={COLORS.accent} />
                  <Text style={s.catText}>{EXPENSE_CATEGORY_LABELS[c.category] ?? c.category}</Text>
                  <Text style={s.catVal}>{formatMoney(c.totalKurus)}</Text>
                </View>
              ))}
            </View>
          )}

          <Text style={s.section}>GİDER KAYITLARI</Text>
          {!!deleteError && <Text style={s.error}>{deleteError}</Text>}
          {items.length === 0 ? (
            <Text style={s.empty}>Bu ay gider girilmemiş. Sağ alttaki + ile ekleyin.</Text>
          ) : (
            items.map((e) => {
              const staffName = typeof e?.staff?.name === 'string' ? e.staff.name : '';
              const title = e.category === 'personel_maasi' && staffName ? `Maaş · ${staffName}` : EXPENSE_CATEGORY_LABELS[e.category] ?? e.category;
              return (
                <Pressable key={e.id} style={s.row} onLongPress={() => handleDelete(e.id, title)} accessibilityLabel={title} accessibilityHint="Silmek için basılı tutun">
                  <View style={s.icon}>
                    <Ionicons name={(EXPENSE_CATEGORY_ICONS[e.category] ?? 'ellipse') as any} size={18} color={COLORS.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.rowTitle}>{title}</Text>
                    <Text style={s.rowSub}>{formatDate(e.expenseDate)}{e?.description ? ` · ${e.description}` : ''}</Text>
                  </View>
                  <Text style={s.amount}>{formatMoney(e.amountKurus)}</Text>
                  <Pressable onPress={() => handleDelete(e.id, title)} style={s.trash} accessibilityLabel="Sil">
                    <Ionicons name="trash-outline" size={18} color={COLORS.textMuted} />
                  </Pressable>
                </Pressable>
              );
            })
          )}
        </ScrollView>
      )}

      <Pressable style={s.fab} onPress={() => router.push('/expense/form')} accessibilityLabel="Yeni gider">
        <Ionicons name="add" size={28} color={COLORS.white} />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md, paddingBottom: 0 },
  monthBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.surfaceBorder, marginBottom: SPACING.md },
  arrow: { width: 52, height: 56, alignItems: 'center', justifyContent: 'center' },
  monthTitle: { color: COLORS.text, fontSize: 17, fontWeight: '700' },
  monthSub: { color: COLORS.textMuted, fontSize: 13 },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.accent, padding: SPACING.md, marginBottom: SPACING.md },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  sumLabel: { color: COLORS.textSecondary, fontSize: 15 },
  sumVal: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  netRow: { borderTopWidth: 0.5, borderTopColor: COLORS.surfaceBorder, marginTop: 4, paddingTop: 8 },
  netLabel: { color: COLORS.text, fontSize: 17, fontWeight: '700' },
  netVal: { fontSize: 20, fontWeight: '800' },
  hint: { color: COLORS.textMuted, fontSize: 13, marginTop: SPACING.xs },
  catWrap: { gap: 6, marginBottom: SPACING.sm },
  cat: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: 4 },
  catText: { flex: 1, color: COLORS.textSecondary, fontSize: 14 },
  catVal: { color: COLORS.text, fontSize: 14, fontWeight: '600' },
  section: { color: COLORS.textMuted, fontSize: 13, fontWeight: '700', letterSpacing: 1, marginTop: SPACING.md, marginBottom: SPACING.xs },
  empty: { color: COLORS.textMuted, fontSize: 14, paddingVertical: SPACING.md },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 60, borderBottomWidth: 0.5, borderBottomColor: COLORS.surfaceBorder, gap: SPACING.sm },
  icon: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  rowSub: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  amount: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
  trash: { width: 40, height: 44, alignItems: 'center', justifyContent: 'center' },
  error: { color: COLORS.error, fontSize: 15, padding: SPACING.md },
  fab: { position: 'absolute', right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', elevation: 4, borderWidth: 1, borderColor: COLORS.accent },
});
