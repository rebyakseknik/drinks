import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useReportsControllerRevenue } from '@/src/api/generated/api';
import { Card } from '@/src/components/Card';
import { COLORS, SPACING } from '@/src/utils/theme';
import { formatMoney, formatDate } from '@/src/utils/format';
import { EmptyState } from '@/src/components/EmptyState';

export default function RevenueReportScreen() {
  const now = new Date();
  const from = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)).toISOString();
  const to = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0)).toISOString();
  const report = useReportsControllerRevenue({ from, to });
  const items = report.data?.items ?? [];

  const totalRevenue = items.reduce((s, i) => s + (i.totalRevenueKurus ?? 0), 0);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Card>
        <Text style={s.totalLabel}>Toplam Ciro</Text>
        <Text style={s.totalValue}>{formatMoney(totalRevenue)}</Text>
      </Card>
      {items.length === 0 ? (
        <EmptyState message="Bu dönem için veri yok" />
      ) : (
        items.map((item, idx) => (
          <View key={idx} style={s.row}>
            <Text style={s.date}>{formatDate(item.date)}</Text>
            <View style={s.right}>
              <Text style={s.amount}>{formatMoney(item.totalRevenueKurus)}</Text>
              <Text style={s.sub}>N: {formatMoney(item.netCashKurus)} K: {formatMoney(item.netCardKurus)}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  totalLabel: { color: COLORS.textSecondary, fontSize: 14 },
  totalValue: { color: COLORS.accent, fontSize: 26, fontWeight: '800' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.md, borderBottomWidth: 0.5, borderBottomColor: COLORS.surfaceBorder },
  date: { color: COLORS.text, fontSize: 14 },
  right: { alignItems: 'flex-end' },
  amount: { color: COLORS.accent, fontSize: 16, fontWeight: '700' },
  sub: { color: COLORS.textMuted, fontSize: 13 },
});
