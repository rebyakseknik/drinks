import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useReportsControllerTopDispatched } from '@/src/api/generated/api';
import { Card } from '@/src/components/Card';
import { COLORS, SPACING } from '@/src/utils/theme';
import { getBaseUnitLabel } from '@/src/utils/format';
import { EmptyState } from '@/src/components/EmptyState';

export default function TopDispatchedScreen() {
  const now = new Date();
  const from = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)).toISOString();
  const to = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0)).toISOString();
  const report = useReportsControllerTopDispatched({ from, to, limit: 10 });
  const items = report.data?.items ?? [];

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.note}>Sevkiyat Miktarları (bu ay)</Text>
      {items.length === 0 ? (
        <EmptyState message="Bu dönem için veri yok" />
      ) : (
        items.map((item, idx) => (
          <Card key={item.productId}>
            <View style={s.row}>
              <View style={s.rank}><Text style={s.rankText}>{idx + 1}</Text></View>
              <View style={s.info}>
                <Text style={s.name}>{item.productName}</Text>
                <Text style={s.qty}>{item.totalDispatched} {getBaseUnitLabel(item.baseUnit)}</Text>
              </View>
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  note: { color: COLORS.textMuted, fontSize: 13, marginBottom: SPACING.md, fontStyle: 'italic' },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  rank: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center' },
  rankText: { color: COLORS.background, fontSize: 14, fontWeight: '800' },
  info: { flex: 1 },
  name: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  qty: { color: COLORS.textSecondary, fontSize: 14 },
});
