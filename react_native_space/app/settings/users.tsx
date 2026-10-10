import React from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Platform, Pressable } from 'react-native';
import { useUsersControllerFindAll, useUsersControllerRemove, useUsersControllerUpdateRole } from '@/src/api/generated/api';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { EmptyState } from '@/src/components/EmptyState';
import { Ionicons } from '@expo/vector-icons';
import { getErrorMessage } from '@/src/api/customFetch';
import { useAuth } from '@/src/contexts/AuthContext';
import type { UserItemDto } from '@/src/api/generated/schemas';

export default function UsersScreen() {
  const { data, isLoading, refetch } = useUsersControllerFindAll();
  const removeMutation = useUsersControllerRemove();
  const roleMutation = useUsersControllerUpdateRole();
  const { user: me } = useAuth();

  const handleRemove = (u: UserItemDto) => {
    const doRemove = () => {
      removeMutation.mutate(
        { id: u?.id },
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
      if (confirm(`${u?.name} kullanıcısını silmek istediğinize emin misiniz?`)) doRemove();
    } else {
      Alert.alert('Kullanıcı Sil', `${u?.name} kullanıcısını silmek istediğinize emin misiniz?`, [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: doRemove },
      ]);
    }
  };

  const handleToggleRole = (u: UserItemDto) => {
    const newRole = u?.role === 'manager' ? 'owner' : 'manager';
    roleMutation.mutate(
      { id: u?.id, data: { role: newRole } },
      {
        onSuccess: () => refetch(),
        onError: (e) => {
          const msg = getErrorMessage(e, 'Rol güncelleme başarısız');
          if (Platform.OS === 'web') alert(msg);
          else Alert.alert('Hata', msg);
        },
      },
    );
  };

  if (isLoading) return <LoadingScreen />;

  const items = data?.items ?? [];

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item?.id ?? ''}
      style={s.container}
      contentContainerStyle={items?.length === 0 ? s.emptyContainer : s.listContent}
      ListEmptyComponent={<EmptyState icon="people" message="Henüz kullanıcı yok" />}
      renderItem={({ item }) => {
        const isMe = item?.id === me?.id;
        return (
          <View style={s.card}>
            <View style={s.cardInfo}>
              <Text style={s.name}>{item?.name ?? ''}</Text>
              <Text style={s.email}>{item?.email ?? ''}</Text>
              <Text style={[s.role, item?.role === 'owner' && s.roleOwner]}>
                {item?.role === 'owner' ? 'Sahip' : 'Yönetici'}
              </Text>
            </View>
            {!isMe && (
              <View style={s.actions}>
                <Pressable onPress={() => handleToggleRole(item)} style={s.actionBtn}>
                  <Ionicons name="swap-vertical" size={20} color={COLORS.accent} />
                </Pressable>
                <Pressable onPress={() => handleRemove(item)} style={s.actionBtn}>
                  <Ionicons name="trash" size={20} color={COLORS.error} />
                </Pressable>
              </View>
            )}
          </View>
        );
      }}
    />
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContent: { padding: SPACING.md },
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
  cardInfo: { flex: 1 },
  name: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  email: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  role: { color: COLORS.textMuted, fontSize: 13, marginTop: 4, textTransform: 'uppercase', fontWeight: '700' },
  roleOwner: { color: COLORS.accent },
  actions: { flexDirection: 'row', gap: SPACING.sm },
  actionBtn: { padding: SPACING.xs },
});
