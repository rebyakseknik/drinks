import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useRouter, useLocalSearchParams, Stack, Redirect } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Crypto from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';
import { useMovementsControllerCreate } from '@/src/api/generated/api';
import type { WarehouseStockItemDto } from '@/src/api/generated/schemas';
import { GradientButton } from '@/src/components/GradientButton';
import { QuantityFields } from '@/src/components/QuantityFields';
import { COLORS, SPACING, RADIUS, TOUCH } from '@/src/utils/theme';
import { getErrorMessage } from '@/src/api/customFetch';
import { useStockMap, packageOf } from '@/src/hooks/useStockMap';
import { inputFields, totalFromFields, formatStock, formatBase } from '@/src/utils/quantity';

const TYPES = [
  { id: 'mal_kabul', label: 'Mal Geldi', title: 'Mal Geldi' },
  { id: 'sevkiyat', label: 'Sevkiyat', title: 'Sevkiyat Yap' },
  { id: 'depoya_iade', label: 'İade', title: 'Depoya İade' },
  { id: 'fire_hasar', label: 'Fire', title: 'Fire / Hasar' },
];
const SUBTRACT = ['sevkiyat', 'fire_hasar'];

/** Koli, kg veya L alanı kullanıldıysa kırılım nota yazılır (yalnız adet/g girişinde gerekmez). */
function usedPackageOrBig(values: Record<string, string>, fields: { key: string }[]): boolean {
  return fields.some((f) => f.key !== 'base' && (values[f.key] ?? '').trim() !== '' && Number((values[f.key] ?? '').replace(',', '.')) > 0);
}

interface Line {
  key: string;
  productId: string;
  values: Record<string, string>;
}

export default function NewMovementScreen() {
  const params = useLocalSearchParams<{ type?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const createMut = useMovementsControllerCreate();
  const { map, items, query: stockQuery } = useStockMap();
  const [type, setType] = useState(TYPES.some((t) => t.id === params.type) ? params.type! : 'sevkiyat');
  const [lines, setLines] = useState<Line[]>([]);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [lineErrors, setLineErrors] = useState<Record<string, string>>({});

  // Çift kayıt koruması: aynı form içeriği için aynı anahtar; içerik değişirse yeni anahtar
  const signature = JSON.stringify({ type, lines, notes });
  const idempotencyKey = useMemo(() => Crypto.randomUUID(), [signature]);

  const subtract = SUBTRACT.includes(type);

  // Her satırın hesaplanmış durumu
  const evaluated = lines.map((l) => {
    const item = map.get(l.productId);
    const pkg = packageOf(item);
    const fields = inputFields(item?.baseUnit ?? 'adet', pkg);
    const res = totalFromFields(l.values, fields, item?.baseUnit ?? 'adet');
    let problem = lineErrors[l.productId] ?? '';
    if (!item) problem = 'Ürün bulunamadı';
    else if (!item.hasInitialStock) problem = 'Başlangıç sayımı yok — önce ürün detayından girin';
    else if (!res.ok) problem = res.error;
    else if (subtract && res.total > item.currentStock)
      problem = `Yetersiz stok: depoda ${formatBase(item.currentStock, item.baseUnit)}, istenen ${formatBase(res.total, item.baseUnit)}`;
    return { line: l, item, pkg, fields, res, problem };
  });
  const filled = evaluated.filter((e) => e.res.ok && e.res.total > 0);
  const blocking = evaluated.some((e) => !!e.problem && !lineErrors[e.line.productId]) || filled.length === 0;

  const matches = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('tr');
    const added = new Set(lines.map((l) => l.productId));
    return items
      .filter((i) => !added.has(i.productId) && (!q || i.productName.toLocaleLowerCase('tr').includes(q)))
      .slice(0, 8);
  }, [items, search, lines]);

  const addProduct = (p: WarehouseStockItemDto) => {
    setLines((prev) => [...prev, { key: Crypto.randomUUID(), productId: p.productId, values: {} }]);
    setSearch('');
    setSearchOpen(false);
    setError('');
  };
  const setValues = (key: string, productId: string, values: Record<string, string>) => {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, values } : l)));
    if (lineErrors[productId]) setLineErrors(({ [productId]: _, ...rest }) => rest);
  };

  const handleSave = async () => {
    if (createMut.isPending) return;
    const bad = evaluated.find((e) => e.problem && (e.res.ok ? e.res.total > 0 : true));
    if (bad) return setError(`${bad.item?.productName ?? 'Ürün'}: ${bad.problem}`);
    if (filled.length === 0) return setError('En az bir ürün için miktar girin');
    setError('');
    Keyboard.dismiss();
    try {
      const result = await createMut.mutateAsync({
        data: {
          idempotencyKey,
          documentDate: new Date().toISOString(),
          type,
          notes: notes.trim() || undefined,
          lines: filled.map((e) => ({
            productId: e.line.productId,
            packageName: e.item!.baseUnit,
            packageQuantity: e.res.ok ? e.res.total : 0,
            conversionFactorUsed: 1,
            // Girilen kırılım (örn. "2 koli + 5 adet") satır notunda saklanır
            notes: usedPackageOrBig(e.line.values, e.fields) && e.res.ok ? e.res.breakdown : undefined,
          })),
        },
      });
      await queryClient.invalidateQueries();
      router.replace(`/movement/${result.id}`);
    } catch (e) {
      const msg = getErrorMessage(e, 'Kaydedilemedi');
      // Sunucu hatasını ilgili ürün satırına da yaz ("Ürün: açıklama; Ürün2: açıklama")
      const perLine: Record<string, string> = {};
      for (const part of msg.split('; ')) {
        const hit = evaluated.find((ev) => ev.item && part.startsWith(`${ev.item.productName}:`));
        if (hit) perLine[hit.line.productId] = part.slice(hit.item!.productName.length + 1).trim();
      }
      setLineErrors(perLine);
      setError(msg);
      stockQuery.refetch();
    }
  };

  if (params.type === 'sayim_duzeltmesi') return <Redirect href="/movement/count" />;

  const title = TYPES.find((t) => t.id === type)?.title ?? 'Yeni Hareket';

  return (
    <KeyboardAvoidingView
      style={s.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 44 : 0}
    >
      <Stack.Screen options={{ title }} />
      <ScrollView style={s.flex} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <View style={s.types}>
          {TYPES.map((t) => (
            <Pressable key={t.id} style={[s.typeChip, type === t.id && s.typeChipOn]} onPress={() => setType(t.id)}>
              <Text style={[s.typeText, type === t.id && s.typeTextOn]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        {!!error && <Text style={s.error}>{error}</Text>}

        {evaluated.map(({ line, item, pkg, fields, res, problem }) => (
          <View key={line.key} style={[s.row, !!problem && res.ok && res.total > 0 && s.rowBad]}>
            <View style={s.rowHead}>
              <Text style={s.rowName} numberOfLines={1}>{item?.productName ?? '…'}</Text>
              <Pressable onPress={() => setLines((prev) => prev.filter((x) => x.key !== line.key))} hitSlop={12} accessibilityLabel="Satırı kaldır">
                <Ionicons name="close-circle" size={24} color={COLORS.textMuted} />
              </Pressable>
            </View>
            {item?.hasInitialStock && (
              <Text style={s.rowStock}>Depoda: {formatStock(item.currentStock, item.baseUnit, pkg)}</Text>
            )}
            {item?.hasInitialStock ? (
              <QuantityFields
                fields={fields}
                values={line.values}
                onChange={(v) => setValues(line.key, line.productId, v)}
                invalid={!!problem && !(res.ok && res.empty)}
                autoFocus={line === lines[lines.length - 1]}
              />
            ) : null}
            {problem && (!res.ok || res.total > 0 || !item?.hasInitialStock) ? (
              <Text style={s.rowError}>{problem}</Text>
            ) : res.ok && res.total > 0 && item ? (
              <Text style={s.rowOk}>
                = {formatBase(res.total, item.baseUnit)}
                {subtract ? ` · kalan ${formatStock(item.currentStock - res.total, item.baseUnit, pkg)}` : ''}
              </Text>
            ) : null}
          </View>
        ))}

        {/* Ürün arama / ekleme */}
        <View style={s.searchBox}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            style={s.searchInput}
            value={search}
            onChangeText={(v) => { setSearch(v); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            placeholder={lines.length ? 'Başka ürün ekle…' : 'Ürün ara ve ekle…'}
            placeholderTextColor={COLORS.textMuted}
            returnKeyType="search"
          />
        </View>
        {(searchOpen || lines.length === 0) &&
          matches.map((p) => (
            <Pressable key={p.productId} style={s.match} onPress={() => addProduct(p)}>
              <Text style={s.matchName} numberOfLines={1}>{p.productName}</Text>
              <Text style={[s.matchStock, !p.hasInitialStock && { color: COLORS.warning }]}>
                {p.hasInitialStock ? formatStock(p.currentStock, p.baseUnit, packageOf(p)) : 'sayım yok'}
              </Text>
            </Pressable>
          ))}
        {(searchOpen || lines.length === 0) && matches.length === 0 && items.length > 0 && (
          <Text style={s.noMatch}>Eşleşen ürün yok</Text>
        )}

        {lines.length > 0 && (
          <TextInput
            style={s.notes}
            value={notes}
            onChangeText={setNotes}
            placeholder="Not (isteğe bağlı)"
            placeholderTextColor={COLORS.textMuted}
          />
        )}
      </ScrollView>

      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, SPACING.sm) }]}>
        <GradientButton
          title={filled.length ? `Kaydet · ${filled.length} ürün` : 'Kaydet'}
          onPress={handleSave}
          loading={createMut.isPending}
          disabled={blocking}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  types: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  typeChip: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    backgroundColor: COLORS.surface,
  },
  typeChipOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  typeText: { color: COLORS.textSecondary, fontSize: 15, fontWeight: '600' },
  typeTextOn: { color: COLORS.white },
  error: { color: COLORS.error, fontSize: 15, marginBottom: SPACING.md },
  row: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: SPACING.sm + 4,
    marginBottom: SPACING.sm,
    gap: 6,
  },
  rowBad: { borderColor: COLORS.error },
  rowHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.sm },
  rowName: { color: COLORS.text, fontSize: 17, fontWeight: '700', flex: 1 },
  rowStock: { color: COLORS.textSecondary, fontSize: 14 },
  rowOk: { color: COLORS.success, fontSize: 14, fontWeight: '600' },
  rowError: { color: COLORS.error, fontSize: 14, fontWeight: '600' },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    minHeight: TOUCH,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.accent + '66',
    backgroundColor: COLORS.surface,
    marginTop: SPACING.xs,
  },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 16, minHeight: TOUCH },
  match: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.sm,
    minHeight: TOUCH,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorder,
  },
  matchName: { color: COLORS.text, fontSize: 16, flex: 1 },
  matchStock: { color: COLORS.textSecondary, fontSize: 14 },
  noMatch: { color: COLORS.textMuted, fontSize: 15, padding: SPACING.md },
  notes: {
    marginTop: SPACING.md,
    minHeight: TOUCH,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorder,
    backgroundColor: COLORS.background,
  },
});
