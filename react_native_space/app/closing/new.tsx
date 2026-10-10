import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useClosingsControllerCreate } from '@/src/api/generated/api';
import { GradientButton } from '@/src/components/GradientButton';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { getErrorMessage } from '@/src/api/customFetch';
import { formatMoney, parseMoneyInput } from '@/src/utils/format';

export default function NewClosingScreen() {
  const router = useRouter();
  const createMut = useClosingsControllerCreate();
  const [cashText, setCashText] = useState('');
  const [cardText, setCardText] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const cashKurus = parseMoneyInput(cashText);
  const cardKurus = parseMoneyInput(cardText);
  const totalKurus = cashKurus + cardKurus;

  const handleSave = async () => {
    setError('');
    try {
      const today = new Date();
      const istanbulOffset = 3 * 60 * 60 * 1000;
      const istanbulNow = new Date(today.getTime() + istanbulOffset);
      const businessDate = new Date(Date.UTC(istanbulNow.getUTCFullYear(), istanbulNow.getUTCMonth(), istanbulNow.getUTCDate())).toISOString();

      const result = await createMut.mutateAsync({
        data: { businessDate, netCashKurus: cashKurus, netCardKurus: cardKurus, notes: notes || undefined },
      });
      router.replace(`/closing/${result.id}`);
    } catch (e) {
      setError(getErrorMessage(e, 'Kaydedilemedi'));
    }
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        {!!error && <Text style={s.error}>{error}</Text>}

        <Text style={s.label}>Nakit Ciro (₺)</Text>
        <TextInput style={s.input} value={cashText} onChangeText={setCashText} keyboardType="numeric" placeholder="0" placeholderTextColor={COLORS.textMuted} />

        <Text style={s.label}>Kart Ciro (₺)</Text>
        <TextInput style={s.input} value={cardText} onChangeText={setCardText} keyboardType="numeric" placeholder="0" placeholderTextColor={COLORS.textMuted} />

        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Toplam:</Text>
          <Text style={s.totalValue}>{formatMoney(totalKurus)}</Text>
        </View>

        <Text style={s.label}>Not</Text>
        <TextInput style={[s.input, { height: 80 }]} value={notes} onChangeText={setNotes} multiline placeholder="İsteğe bağlı" placeholderTextColor={COLORS.textMuted} />

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
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.lg, paddingVertical: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.surfaceBorder },
  totalLabel: { color: COLORS.textSecondary, fontSize: 16 },
  totalValue: { color: COLORS.accent, fontSize: 22, fontWeight: '800' },
});
