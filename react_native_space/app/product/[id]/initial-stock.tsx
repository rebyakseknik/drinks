import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProductsControllerSetInitialStock } from '@/src/api/generated/api';
import { GradientButton } from '@/src/components/GradientButton';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { getErrorMessage } from '@/src/api/customFetch';

export default function InitialStockScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const setStockMut = useProductsControllerSetInitialStock();
  const [count, setCount] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    const c = parseInt(count);
    if (isNaN(c) || c < 0) { setError('Geçerli bir sayı girin'); return; }
    setError('');
    try {
      await setStockMut.mutateAsync({ id, data: { count: c, date: new Date().toISOString() } });
      router.back();
    } catch (e) {
      setError(getErrorMessage(e, 'Kaydedilemedi'));
    }
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        {!!error && <Text style={s.error}>{error}</Text>}
        <Text style={s.label}>Başlangıç Stok Miktarı (temel birim)</Text>
        <TextInput style={s.input} value={count} onChangeText={setCount} keyboardType="numeric" placeholder="0" placeholderTextColor={COLORS.textMuted} />
        <Text style={s.note}>Not: Başlangıç stoğu sadece bir kez girilebilir.</Text>
        <GradientButton title="Kaydet" onPress={handleSave} loading={setStockMut.isPending} style={{ marginTop: SPACING.lg }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { padding: SPACING.md },
  error: { color: COLORS.error, fontSize: 14, marginBottom: SPACING.md },
  label: { color: COLORS.textSecondary, fontSize: 14, marginBottom: SPACING.xs, marginTop: SPACING.md },
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder, borderRadius: RADIUS.md, color: COLORS.text, fontSize: 16, padding: SPACING.md, height: 48 },
  note: { color: COLORS.warning, fontSize: 12, marginTop: SPACING.sm },
});
