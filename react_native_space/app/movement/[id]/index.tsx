import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Platform, Pressable, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useMovementsControllerFindOne, useMovementsControllerReverse } from '@/src/api/generated/api';
import { Card } from '@/src/components/Card';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { GradientButton } from '@/src/components/GradientButton';
import { COLORS, SPACING } from '@/src/utils/theme';
import { formatDate, getMovementTypeLabel, getBaseUnitLabel } from '@/src/utils/format';
import { getErrorMessage } from '@/src/api/customFetch';

export default function MovementDetailScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const doc = useMovementsControllerFindOne(id, { query: { enabled: !!id } });
  const reverseMut = useMovementsControllerReverse();

  useFocusEffect(useCallback(() => { doc.refetch(); }, []));

  if (doc.isLoading) return <LoadingScreen />;
  const d = doc.data;
  if (!d) return <Text style={{ color: COLORS.error, padding: SPACING.md }}>Belge bulunamadı</Text>;

  const createdBy = d.createdBy as { id: string; name: string } | null;

  const handleReverse = () => {
    const doReverse = async () => {
      try {
        await reverseMut.mutateAsync({ id, data: {} });
        doc.refetch();
      } catch (e) {
        const msg = getErrorMessage(e, 'İptal edilemedi');
        if (Platform.OS === 'web') alert(msg);
        else Alert.alert('Hata', msg);
      }
    };
    if (Platform.OS === 'web') {
      if (confirm('Bu hareketi iptal etmek istediğinize emin misiniz?')) doReverse();
    } else {
      Alert.alert('İptal Et', 'Bu hareketi iptal etmek istediğinize emin misiniz?', [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'İptal Et', style: 'destructive', onPress: doReverse },
      ]);
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content} refreshControl={<RefreshControl refreshing={doc.isLoading} onRefresh={() => doc.refetch()} tintColor={COLORS.accent} />}>
      <Card>
        <View style={s.row}>
          <View style={[s.badge, d.status === 'reversed' ? s.badgeRed : s.badgeGreen]}>
            <Text style={s.badgeText}>{d.status === 'reversed' ? 'İptal Edildi' : 'Aktif'}</Text>
          </View>
          <View style={s.typeBadge}>
            <Text style={s.typeBadgeText}>{getMovementTypeLabel(d.type)}</Text>
          </View>
        </View>
        <Text style={s.info}>Tarih: {formatDate(d.documentDate)}</Text>
        <Text style={s.info}>Oluşturan: {createdBy?.name ?? '-'}</Text>
        {d.notes && <Text style={s.info}>Not: {d.notes}</Text>}
      </Card>

      <Text style={s.sectionTitle}>Satırlar ({d.lines?.length ?? 0})</Text>
      {(d.lines ?? []).map((line) => (
        <Card key={line.id}>
          <Text style={s.lineName}>{line.productName}</Text>
          <Text style={s.info}>{Math.abs(line.quantity)} {getBaseUnitLabel(line.packageName)}</Text>
          <Text style={s.muted}>{line.packageQuantity} {line.packageName} × {line.conversionFactorUsed}</Text>
          {line.reason && <Text style={s.info}>Sebep: {line.reason}</Text>}
        </Card>
      ))}

      {d.status === 'active' && (
        <GradientButton title="İptal Et" onPress={handleReverse} loading={reverseMut.isPending} variant="danger" style={{ marginTop: SPACING.md }} />
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  row: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  badge: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: 8 },
  badgeGreen: { backgroundColor: COLORS.success + '30' },
  badgeRed: { backgroundColor: COLORS.error + '30' },
  badgeText: { color: COLORS.text, fontSize: 12, fontWeight: '600' },
  typeBadge: { backgroundColor: COLORS.primary + '30', paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: 8 },
  typeBadgeText: { color: COLORS.primaryLight, fontSize: 12, fontWeight: '600' },
  info: { color: COLORS.textSecondary, fontSize: 14, marginTop: 2 },
  muted: { color: COLORS.textMuted, fontSize: 12 },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginTop: SPACING.lg, marginBottom: SPACING.sm },
  lineName: { color: COLORS.accent, fontSize: 15, fontWeight: '600' },
});
