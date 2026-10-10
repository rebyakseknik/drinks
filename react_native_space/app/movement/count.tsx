import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Crypto from 'expo-crypto';
import { Ionicons } from '@expo/vector-icons';
import { useMovementsControllerCreate } from '@/src/api/generated/api';
import { GradientButton } from '@/src/components/GradientButton';
import { QuantityFields } from '@/src/components/QuantityFields';
import { COLORS, SPACING, RADIUS, TOUCH } from '@/src/utils/theme';
import { ApiError, getErrorMessage } from '@/src/api/customFetch';
import { useStockMap, packageOf } from '@/src/hooks/useStockMap';
import { inputFields, totalFromFields, formatStock, formatSigned, countSummary } from '@/src/utils/quantity';

export default function CountScreen() {
  const params = useLocalSearchParams<{ productId?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const createMut = useMovementsControllerCreate();
  const { map, items, query: stockQuery } = useStockMap();
  const [productId, setProductId] = useState(params.productId ?? '');
  const [search, setSearch] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [changed, setChanged] = useState('');

  const item = map.get(productId);
  const pkg = packageOf(item);
  const unit = item?.baseUnit ?? 'adet';
  const fields = inputFields(unit, pkg);
  const res = totalFromFields(values, fields, unit);
  const system = item?.currentStock ?? 0;
  const summary = res.ok && !res.empty ? countSummary(system, res.total) : null;

  // Aynı içerik + aynı sistem stoğu için aynı anahtar; stok değişirse yeni anahtar
  const signature = JSON.stringify({ productId, values, reason, system });
  const idempotencyKey = useMemo(() => Crypto.randomUUID(), [signature]);

  const matches = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('tr');
    return items
      .filter((i) => i.hasInitialStock && (!q || i.productName.toLocaleLowerCase('tr').includes(q)))
      .slice(0, 8);
  }, [items, search]);

  const canSave = !!item && !!summary && summary.diff !== 0 && reason.trim().length > 0;

  const handleSave = async () => {
    if (!item || !summary || createMut.isPending) return;
    if (!reason.trim()) return setError('Düzeltme nedenini yazın');
    setError('');
    setChanged('');
    Keyboard.dismiss();
    try {
      const result = await createMut.mutateAsync({
        data: {
          idempotencyKey,
          documentDate: new Date().toISOString(),
          type: 'sayim_duzeltmesi',
          lines: [
            {
              productId: item.productId,
              packageName: item.baseUnit,
              packageQuantity: summary.diff,
              conversionFactorUsed: 1,
              reason: reason.trim(),
              // Sunucu, kayıt anındaki stok bundan farklıysa düzeltmeyi yapmaz
              expectedStock: system,
            },
          ],
        },
      });
      await queryClient.invalidateQueries();
      router.replace(`/movement/${result.id}`);
    } catch (e) {
      const body = e instanceof ApiError ? (e.body as { code?: string; currentStock?: number } | null) : null;
      if (body?.code === 'STOCK_CHANGED') {
        // Eski değere göre sessizce düzeltme yapılmaz: güncel stok alınır, özet yeniden hesaplanır
        await stockQuery.refetch();
        setChanged(
          `Siz sayarken stok değişti. Sistemdeki stok artık ${formatStock(body.currentStock ?? 0, unit, pkg)}. Özeti kontrol edip tekrar kaydedin.`,
        );
      } else {
        setError(getErrorMessage(e, 'Kaydedilemedi'));
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 44 : 0}
    >
      <ScrollView style={s.flex} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        {!item ? (
          <>
            <Text style={s.label}>Sayılan ürün</Text>
            <View style={s.searchBox}>
              <Ionicons name="search" size={20} color={COLORS.textMuted} />
              <TextInput
                style={s.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Ürün ara…"
                placeholderTextColor={COLORS.textMuted}
                autoFocus
              />
            </View>
            {matches.map((p) => (
              <Pressable key={p.productId} style={s.match} onPress={() => { setProductId(p.productId); setValues({}); }}>
                <Text style={s.matchName} numberOfLines={1}>{p.productName}</Text>
                <Text style={s.matchStock}>{formatStock(p.currentStock, p.baseUnit, packageOf(p))}</Text>
              </Pressable>
            ))}
            {matches.length === 0 && !stockQuery.isLoading && <Text style={s.muted}>Sayımı girilmiş ürün bulunamadı</Text>}
          </>
        ) : (
          <>
            <View style={s.productHead}>
              <Text style={s.product}>{item.productName}</Text>
              {!params.productId && (
                <Pressable onPress={() => { setProductId(''); setValues({}); setChanged(''); }} hitSlop={10}>
                  <Text style={s.link}>Değiştir</Text>
                </Pressable>
              )}
            </View>

            <Text style={s.label}>Sayımda bulunan miktar</Text>
            <QuantityFields fields={fields} values={values} onChange={(v) => { setValues(v); setChanged(''); }} invalid={!res.ok} autoFocus />
            {!res.ok && <Text style={s.error}>{res.error}</Text>}

            {!!changed && (
              <View style={s.changed}>
                <Ionicons name="refresh-circle" size={22} color={COLORS.warning} />
                <Text style={s.changedText}>{changed}</Text>
              </View>
            )}

            <View style={s.summary}>
              <SummaryRow label="Sistemdeki stok" value={formatStock(system, unit, pkg)} />
              <SummaryRow label="Sayımda bulunan" value={summary ? formatStock(summary.after, unit, pkg) : '—'} />
              <SummaryRow
                label="Hesaplanan düzeltme"
                value={summary ? formatSigned(summary.diff, unit) : '—'}
                color={summary ? (summary.diff < 0 ? COLORS.error : summary.diff > 0 ? COLORS.success : COLORS.text) : undefined}
                bold
              />
              <SummaryRow label="İşlem sonrası stok" value={summary ? formatStock(summary.after, unit, pkg) : '—'} bold />
            </View>
            {summary && summary.diff === 0 && <Text style={s.muted}>Sayım sistemle aynı; düzeltme gerekmez.</Text>}

            <Text style={s.label}>Düzeltme nedeni</Text>
            <TextInput
              style={s.reason}
              value={reason}
              onChangeText={setReason}
              placeholder="Örn. ay sonu sayımı"
              placeholderTextColor={COLORS.textMuted}
            />
            {!!error && <Text style={s.error}>{error}</Text>}
          </>
        )}
      </ScrollView>

      {item && (
        <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, SPACING.sm) }]}>
          <GradientButton title="Düzeltmeyi Kaydet" onPress={handleSave} loading={createMut.isPending} disabled={!canSave} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

function SummaryRow({ label, value, color, bold }: { label: string; value: string; color?: string; bold?: boolean }) {
  return (
    <View style={s.sumRow}>
      <Text style={s.sumLabel}>{label}</Text>
      <Text style={[s.sumValue, bold && { fontWeight: '800' }, color ? { color } : null]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  productHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  product: { color: COLORS.accent, fontSize: 24, fontWeight: '800', flex: 1 },
  link: { color: COLORS.accent, fontSize: 16, fontWeight: '600' },
  label: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600', marginTop: SPACING.md, marginBottom: SPACING.sm },
  muted: { color: COLORS.textMuted, fontSize: 15, marginTop: SPACING.sm },
  error: { color: COLORS.error, fontSize: 15, marginTop: SPACING.sm },
  summary: { marginTop: SPACING.md, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: SPACING.md, gap: SPACING.sm },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.sm },
  sumLabel: { color: COLORS.textSecondary, fontSize: 16 },
  sumValue: { color: COLORS.text, fontSize: 17, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  changed: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.warning + '1F',
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  changedText: { color: COLORS.warning, fontSize: 15, flex: 1, fontWeight: '600' },
  reason: {
    minHeight: TOUCH,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    fontSize: 16,
  },
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
  footer: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorder,
    backgroundColor: COLORS.background,
  },
});
