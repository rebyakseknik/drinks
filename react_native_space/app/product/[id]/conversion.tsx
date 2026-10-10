import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useProductsControllerCreateConversion } from '@/src/api/generated/api';
import { GradientButton } from '@/src/components/GradientButton';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { getErrorMessage } from '@/src/api/customFetch';

export default function ConversionScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const createMut = useProductsControllerCreateConversion();
  const [packageName, setPackageName] = useState('');
  const [factor, setFactor] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!packageName.trim() || !factor) { setError('Tüm alanları doldurun'); return; }
    setError('');
    try {
      await createMut.mutateAsync({
        id,
        data: { packageName: packageName.trim(), conversionFactor: parseInt(factor), effectiveFrom: new Date().toISOString() },
      });
      await queryClient.invalidateQueries();
      router.back();
    } catch (e) {
      setError(getErrorMessage(e, 'Kaydedilemedi'));
    }
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        {!!error && <Text style={s.error}>{error}</Text>}
        <Text style={s.label}>Paket Adı (Örn: koli, kilogram)</Text>
        <TextInput style={s.input} value={packageName} onChangeText={setPackageName} placeholder="koli" placeholderTextColor={COLORS.textMuted} />
        <Text style={s.label}>Dönüşüm Faktörü (1 paket = ? birim)</Text>
        <TextInput style={s.input} value={factor} onChangeText={setFactor} keyboardType="numeric" placeholder="24" placeholderTextColor={COLORS.textMuted} />
        <GradientButton title="Kaydet" onPress={handleSave} loading={createMut.isPending} style={{ marginTop: SPACING.lg }} />
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
});
