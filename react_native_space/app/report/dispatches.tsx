import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useReportsControllerDispatches } from '@/src/api/generated/api';
import { Card } from '@/src/components/Card';
import { COLORS, SPACING } from '@/src/utils/theme';
import { getBaseUnitLabel, formatDateTime } from '@/src/utils/format';
import { EmptyState } from '@/src/components/EmptyState';

export default function DispatchReportScreen() {
  const now = new Date();
  const from = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)).toISOString();
  const to = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0)).toISOString();
  const report = useReportsControllerDispatches({ from, to });
  const items = report.data?.items ?? [];

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {items.length === 0 ? (
        <EmptyState message="Bu dönem için sevkiyat yok" />
      ) : (
        items.map((item) => (
          <Card key={item.documentId}>
            <Text style={s.date}>{formatDateTime(item.documentDate)} - {item.createdByName}</Text>
            {(item.lines ?? []).map((l, idx) => (
              <Text key={idx} style={s.line}>{l.productName}: {l.quantity} {getBaseUnitLabel(l.baseUnit)}</Text>
            ))}
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  date: { color: COLORS.accent, fontSize: 14, fontWeight: '600' },
  line: { color: COLORS.textSecondary, fontSize: 14, marginTop: 2 },
});
