import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useAuditControllerFindAll } from '@/src/api/generated/api';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { EmptyState } from '@/src/components/EmptyState';
import { formatDate } from '@/src/utils/format';
import type { AuditLogItemDto } from '@/src/api/generated/schemas';

const ACTION_LABELS: Record<string, string> = {
  create: 'Oluşturma',
  update: 'Güncelleme',
  delete: 'Silme',
  reverse: 'İptal',
  login: 'Giriş',
  signup: 'Kayıt',
};

const ENTITY_LABELS: Record<string, string> = {
  product: 'Ürün',
  movement: 'Hareket',
  closing: 'Kapanış',
  user: 'Kullanıcı',
  invite: 'Davet',
  settings: 'Ayarlar',
  initial_stock: 'Başlangıç Stoğu',
  conversion: 'Dönüşüm',
};

export default function AuditLogScreen() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAuditControllerFindAll({ page, limit: 30 });

  if (isLoading && page === 1) return <LoadingScreen />;

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleLoadMore = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const renderItem = ({ item }: { item: AuditLogItemDto }) => (
    <View style={s.card}>
      <View style={s.row}>
        <Text style={s.action}>{ACTION_LABELS[item?.action ?? ''] ?? item?.action ?? ''}</Text>
        <Text style={s.entity}>{ENTITY_LABELS[item?.entityType ?? ''] ?? item?.entityType ?? ''}</Text>
      </View>
      <Text style={s.actor}>{item?.actorName ?? 'Sistem'}</Text>
      {!!item?.details && <Text style={s.details}>{item?.details}</Text>}
      <Text style={s.date}>{formatDate(item?.createdAt)}</Text>
    </View>
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item?.id ?? Math.random().toString()}
      style={s.container}
      contentContainerStyle={items?.length === 0 ? s.emptyContainer : s.listContent}
      ListEmptyComponent={<EmptyState icon="time" message="Henüz işlem geçmişi yok" />}
      renderItem={renderItem}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.3}
    />
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContent: { padding: SPACING.md },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  row: { flexDirection: 'row', gap: SPACING.sm, marginBottom: 4 },
  action: { color: COLORS.primary, fontSize: 13, fontWeight: '700' },
  entity: { color: COLORS.accent, fontSize: 13, fontWeight: '600' },
  actor: { color: COLORS.textSecondary, fontSize: 13 },
  details: { color: COLORS.textMuted, fontSize: 12, marginTop: 4 },
  date: { color: COLORS.textMuted, fontSize: 11, marginTop: 6 },
});
