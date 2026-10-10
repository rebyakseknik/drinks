import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProductsControllerSetInitialStock, useProductsControllerFindOne } from '@/src/api/generated/api';
import { GradientButton } from '@/src/components/GradientButton';
import { QuantityFields } from '@/src/components/QuantityFields';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { getErrorMessage } from '@/src/api/customFetch';
import { useStockMap, packageOf } from '@/src/hooks/useStockMap';
import { inputFields, totalFromFields, formatStock, formatBase } from '@/src/utils/quantity';

export default function InitialStockScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const product = useProductsControllerFindOne(id, { query: { enabled: !!id } });
  const { map } = useStockMap();
  const setStockMut = useProductsControllerSetInitialStock();
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const p = product.data;
  if (product.isLoading || !p) return <LoadingScreen />;

  const pkg = packageOf(map.get(id));
  const fields = inputFields(p.baseUnit, pkg);
  const result = totalFromFields(values, fields, p.baseUnit);

  const handleSave = async () => {
    if (!result.ok) return setError(result.error);
    if (result.empty) return setError('Miktar girin (depoda yoksa 0 yazın)');
    setError('');
    try {
      await setStockMut.mutateAsync({ id, data: { count: result.total, date: new Date().toISOString() } });
      await queryClient.invalidateQueries();
      router.back();
    } catch (e) {
      setError(getErrorMessage(e, 'Kaydedilemedi'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 44 : 0}
    >
      <Stack.Screen options={{ title: 'Başlangıç Stoğu' }} />
      <ScrollView style={s.flex} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <Text style={s.product}>{p.name}</Text>
        <Text style={s.hint}>Depoda şu an sayılan miktar</Text>

        {p.initialStock ? (
          <Text style={s.done}>Bu ürünün başlangıç stoğu zaten girilmiş: {formatBase(p.initialStock.count, p.baseUnit)}</Text>
        ) : (
          <>
            <QuantityFields fields={fields} values={values} onChange={setValues} invalid={!result.ok} autoFocus />
            {!pkg && p.baseUnit === 'adet' && (
              <Pressable onPress={() => router.push(`/product/${id}/conversion`)} hitSlop={8} style={{ marginTop: SPACING.sm }}>
                <Text style={s.link}>+ Koli içeriği tanımla (koli ile girmek için)</Text>
              </Pressable>
            )}
            <View style={s.totalBox}>
              <Text style={s.totalLabel}>Kaydedilecek</Text>
              <Text style={s.totalValue}>
                {result.ok && !result.empty ? formatStock(result.total, p.baseUnit, pkg) : '—'}
              </Text>
            </View>
            {!!error && <Text style={s.error}>{error}</Text>}
            <Text style={s.note}>Yalnızca bir kez girilir; sonraki farklar için Sayım Düzeltmesi.</Text>
          </>
        )}
      </ScrollView>
      {!p.initialStock && (
        <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, SPACING.md) }]}>
          <GradientButton title="Kaydet" onPress={handleSave} loading={setStockMut.isPending} disabled={!result.ok || result.empty} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md },
  product: { color: COLORS.accent, fontSize: 24, fontWeight: '800' },
  hint: { color: COLORS.textSecondary, fontSize: 16, marginTop: SPACING.xs, marginBottom: SPACING.md },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  totalLabel: { color: COLORS.textSecondary, fontSize: 16 },
  totalValue: { color: COLORS.text, fontSize: 20, fontWeight: '800' },
  error: { color: COLORS.error, fontSize: 15, marginTop: SPACING.md },
  note: { color: COLORS.textMuted, fontSize: 14, marginTop: SPACING.md },
  link: { color: COLORS.accent, fontSize: 15, fontWeight: '600' },
  done: { color: COLORS.success, fontSize: 16 },
  footer: { padding: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.surfaceBorder, backgroundColor: COLORS.background },
});
