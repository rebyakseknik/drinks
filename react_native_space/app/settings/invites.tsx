import React from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Platform, Pressable } from 'react-native';
import { useInvitesControllerFindAll, useInvitesControllerCreate, useInvitesControllerRemove } from '@/src/api/generated/api';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { EmptyState } from '@/src/components/EmptyState';
import { GradientButton } from '@/src/components/GradientButton';
import { Ionicons } from '@expo/vector-icons';
import { getErrorMessage } from '@/src/api/customFetch';
import { formatDate } from '@/src/utils/format';
import * as Clipboard from 'expo-clipboard';
import type { InviteItemDto } from '@/src/api/generated/schemas';

export default function InvitesScreen() {
  const { data, isLoading, refetch } = useInvitesControllerFindAll();
  const createMutation = useInvitesControllerCreate();
  const removeMutation = useInvitesControllerRemove();

  const handleCreate = () => {
    createMutation.mutate(undefined as any, {
      onSuccess: () => refetch(),
      onError: (e) => {
        const msg = getErrorMessage(e, 'Davet kodu oluşturulamadı');
        if (Platform.OS === 'web') alert(msg);
        else Alert.alert('Hata', msg);
      },
    });
  };

  const handleCopy = async (code: string) => {
    try {
      if (Platform.OS === 'web') {
        await navigator?.clipboard?.writeText?.(code);
      } else {
        await Clipboard.setStringAsync(code);
      }
      if (Platform.OS === 'web') alert('Kod kopyalandı');
      else Alert.alert('Kopyalandı', code);
    } catch {
      // ignore
    }
  };

  const handleRemove = (invite: InviteItemDto) => {
    const doRemove = () => {
      removeMutation.mutate(
        { id: invite?.id },
        {
          onSuccess: () => refetch(),
          onError: (e) => {
            const msg = getErrorMessage(e, 'Silme başarısız');
            if (Platform.OS === 'web') alert(msg);
            else Alert.alert('Hata', msg);
          },
        },
      );
    };
    if (Platform.OS === 'web') {
      if (confirm('Bu davet kodunu silmek istediğinize emin misiniz?')) doRemove();
    } else {
      Alert.alert('Sil', 'Bu davet kodunu silmek istediğinize emin misiniz?', [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: doRemove },
      ]);
    }
  };

  if (isLoading) return <LoadingScreen />;

  const items = data?.items ?? [];

  return (
    <View style={s.container}>
      <View style={s.header}>
        <GradientButton
          title="Yeni Davet Kodu"
          onPress={handleCreate}
          loading={createMutation?.isPending}
        />
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item?.id ?? ''}
        contentContainerStyle={items?.length === 0 ? s.emptyContainer : s.listContent}
        ListEmptyComponent={<EmptyState icon="key" message="Henüz davet kodu yok" />}
        renderItem={({ item }) => {
          const used = !!item?.usedBy;
          const expired = new Date(item?.expiresAt ?? '') < new Date();
          const active = item?.isActive && !used && !expired;
          return (
            <View style={[s.card, !active && s.cardInactive]}>
              <View style={s.cardInfo}>
                <Text style={s.code}>{item?.code ?? ''}</Text>
                <Text style={s.date}>Son Kullanma: {formatDate(item?.expiresAt)}</Text>
                {used && (
                  <Text style={s.usedBy}>
                    Kullanan: {(item?.usedBy as any)?.name ?? 'Bilinmiyor'}
                  </Text>
                )}
                {!active && !used && (
                  <Text style={s.expiredLabel}>Süresi dolmuş</Text>
                )}
              </View>
              <View style={s.actions}>
                {active && (
                  <Pressable onPress={() => handleCopy(item?.code ?? '')} style={s.actionBtn}>
                    <Ionicons name="copy" size={20} color={COLORS.primary} />
                  </Pressable>
                )}
                <Pressable onPress={() => handleRemove(item)} style={s.actionBtn}>
                  <Ionicons name="trash" size={20} color={COLORS.error} />
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: SPACING.md },
  listContent: { padding: SPACING.md, paddingTop: 0 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  cardInactive: { opacity: 0.5 },
  cardInfo: { flex: 1 },
  code: { color: COLORS.accent, fontSize: 16, fontWeight: '700' },
  date: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
  usedBy: { color: COLORS.primary, fontSize: 12, marginTop: 2 },
  expiredLabel: { color: COLORS.error, fontSize: 12, marginTop: 2 },
  actions: { flexDirection: 'row', gap: SPACING.sm },
  actionBtn: { padding: SPACING.xs },
});
