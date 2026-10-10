import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useClosingsControllerFindAll, useClosingsControllerSummary } from '@/src/api/generated/api';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { formatMoney, formatDate, getWeekdayName, getMonthName } from '@/src/utils/format';
import { Card } from '@/src/components/Card';
import { Ionicons } from '@expo/vector-icons';

export default function RevenueScreen() {
  const router = useRouter();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const monthStart = new Date(Date.UTC(year, month, 1)).toISOString();
  const monthEnd = new Date(Date.UTC(year, month + 1, 0)).toISOString();
  const dateParam = new Date(Date.UTC(year, month, 15)).toISOString();

  const closings = useClosingsControllerFindAll({ from: monthStart, to: monthEnd, limit: 31 });
  const summary = useClosingsControllerSummary({ date: dateParam });

  useFocusEffect(useCallback(() => { closings.refetch(); summary.refetch(); }, [year, month]));

  const items = closings.data?.items ?? [];

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  return (
    <View style={s.container}>
      <View style={s.monthNav}>
        <Pressable onPress={prevMonth} style={s.navBtn}><Ionicons name="chevron-back" size={24} color={COLORS.text} /></Pressable>
        <Text style={s.monthLabel}>{getMonthName(month)} {year}</Text>
        <Pressable onPress={nextMonth} style={s.navBtn}><Ionicons name="chevron-forward" size={24} color={COLORS.text} /></Pressable>
      </View>

      {summary.data && (
        <Card style={{ marginHorizontal: SPACING.md }}>
          <Text style={s.summaryTotal}>{formatMoney(summary.data.totalRevenueKurus)}</Text>
          <View style={s.row}>
            <Text style={s.sub}>Nakit: {formatMoney(summary.data.totalCashKurus)}</Text>
            <Text style={s.sub}>Kart: {formatMoney(summary.data.totalCardKurus)}</Text>
          </View>
          <Text style={s.sub}>{summary.data.daysRecorded} gün kaydedildi</Text>
        </Card>
      )}

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        refreshControl={<RefreshControl refreshing={closings.isLoading} onRefresh={() => { closings.refetch(); summary.refetch(); }} tintColor={COLORS.accent} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <Pressable style={s.dayRow} onPress={() => router.push(`/closing/${item.id}`)}>
            <View>
              <Text style={s.dayDate}>{formatDate(item.businessDate)} {getWeekdayName(item.businessDate)}</Text>
            </View>
            <View style={s.dayRight}>
              <Text style={s.dayTotal}>{formatMoney(item.totalRevenueKurus)}</Text>
              <Text style={s.daySub}>N: {formatMoney(item.netCashKurus)} K: {formatMoney(item.netCardKurus)}</Text>
            </View>
          </Pressable>
        )}
      />

      <Pressable style={s.fab} onPress={() => router.push('/closing/new')}>
        <Ionicons name="add" size={28} color={COLORS.white} />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: SPACING.md },
  navBtn: { padding: SPACING.sm },
  monthLabel: { color: COLORS.text, fontSize: 18, fontWeight: '700', marginHorizontal: SPACING.md },
  summaryTotal: { color: COLORS.accent, fontSize: 24, fontWeight: '800' },
  row: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.xs },
  sub: { color: COLORS.textSecondary, fontSize: 13 },
  dayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, borderBottomWidth: 0.5, borderBottomColor: COLORS.surfaceBorder },
  dayDate: { color: COLORS.text, fontSize: 14 },
  dayRight: { alignItems: 'flex-end' },
  dayTotal: { color: COLORS.accent, fontSize: 16, fontWeight: '700' },
  daySub: { color: COLORS.textMuted, fontSize: 11 },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', elevation: 4 },
});
