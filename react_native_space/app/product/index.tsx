import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProductsControllerFindAll } from '@/src/api/generated/api';
import type { ProductResponseDto } from '@/src/api/generated/schemas';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { EmptyState } from '@/src/components/EmptyState';
import { Chip } from '@/src/components/Chip';
import { getErrorMessage } from '@/src/api/customFetch';
import { getBaseUnitLabel } from '@/src/utils/format';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';

type Filter = 'active' | 'inactive' | 'all';

const ProductRow = React.memo(function ProductRow({ item, onPress }: { item: ProductResponseDto; onPress: (id: string) => void }) {
  return (
    <Pressable style={[s.row, !item?.active && { opacity: 0.55 }]} onPress={() => onPress(item.id)} accessibilityLabel={item?.name ?? 'Ürün'}>
      <View style={{ flex: 1 }}>
        <Text style={s.name}>{item?.name ?? ''}</Text>
        <Text style={s.sub}>{item?.category ?? ''} · {getBaseUnitLabel(item?.baseUnit ?? '')}</Text>
      </View>
      {!item?.active && <Text style={s.badge}>Pasif</Text>}
      <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
    </Pressable>
  );
});

export default function ProductListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('active');
  const { data, isLoading, isError, error, refetch, isRefetching } = useProductsControllerFindAll();

  const items = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('tr');
    return (data?.items ?? [])
      .filter((p) => (filter === 'all' ? true : filter === 'active' ? p?.active : !p?.active))
      .filter((p) => !q || (p?.name ?? '').toLocaleLowerCase('tr').includes(q) || (p?.category ?? '').toLocaleLowerCase('tr').includes(q))
      .sort((a, b) => (a?.name ?? '').localeCompare(b?.name ?? '', 'tr'));
  }, [data, search, filter]);

  const open = useCallback((id: string) => router.push(`/product/${id}`), [router]);
  const renderItem = useCallback(({ item }: { item: ProductResponseDto }) => <ProductRow item={item} onPress={open} />, [open]);

  if (isLoading) return <LoadingScreen />;

  return (
    <View style={s.container}>
      <View style={s.searchBox}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput style={s.search} value={search} onChangeText={setSearch} placeholder="Ürün veya kategori ara" placeholderTextColor={COLORS.textMuted} />
      </View>
      <View style={s.chips}>
        <Chip label="Aktif" selected={filter === 'active'} onPress={() => setFilter('active')} />
        <Chip label="Pasif" selected={filter === 'inactive'} onPress={() => setFilter('inactive')} />
        <Chip label="Tümü" selected={filter === 'all'} onPress={() => setFilter('all')} />
      </View>
      {isError ? (
        <Pressable onPress={() => refetch()}><Text style={s.error}>{getErrorMessage(error, 'Ürünler yüklenemedi')} — tekrar dene</Text></Pressable>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(p) => p.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.accent} />}
          ListHeaderComponent={<Text style={s.count}>{items.length} ürün</Text>}
          ListEmptyComponent={<EmptyState message={search ? 'Aramaya uyan ürün yok' : 'Henüz ürün yok. Sağ alttaki + ile ekleyin.'} icon="pricetags-outline" />}
        />
      )}
      <Pressable style={s.fab} onPress={() => router.push('/product/new')} accessibilityLabel="Yeni ürün">
        <Ionicons name="add" size={28} color={COLORS.white} />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md, paddingBottom: 0 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, height: 48 },
  search: { flex: 1, color: COLORS.text, fontSize: 16 },
  chips: { flexDirection: 'row', gap: SPACING.sm, marginVertical: SPACING.md },
  count: { color: COLORS.textMuted, fontSize: 13, marginBottom: SPACING.xs },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 60, paddingVertical: SPACING.sm, borderBottomWidth: 0.5, borderBottomColor: COLORS.surfaceBorder, gap: SPACING.sm },
  name: { color: COLORS.text, fontSize: 16, fontWeight: '600' },
  sub: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  badge: { color: COLORS.warning, fontSize: 13, fontWeight: '700', borderWidth: 1, borderColor: COLORS.warning, borderRadius: RADIUS.sm, paddingHorizontal: 6, paddingVertical: 2 },
  error: { color: COLORS.error, fontSize: 15, padding: SPACING.md },
  fab: { position: 'absolute', right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', elevation: 4, borderWidth: 1, borderColor: COLORS.accent },
});
