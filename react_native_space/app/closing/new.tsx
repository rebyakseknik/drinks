import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useClosingsControllerCreate } from '@/src/api/generated/api';
import { GradientButton } from '@/src/components/GradientButton';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { getErrorMessage } from '@/src/api/customFetch';
import { formatMoney, parseMoneyInput, formatDate, getWeekdayName, istanbulToday, addDaysToDay } from '@/src/utils/format';

export default function NewClosingScreen() {
  const router = useRouter();
  const createMut = useClosingsControllerCreate();
  const queryClient = useQueryClient();
  const today = istanbulToday();
  // Varsayılan bugün; geçmiş günler için geri alınabilir, ileri tarih seçilemez
  const params = useLocalSearchParams<{ day?: string }>();
  const initialDay = params.day && /^\d{4}-\d{2}-\d{2}$/.test(params.day) && params.day <= today ? params.day : today;
  const [day, setDay] = useState(initialDay);
  const [cashText, setCashText] = useState('');
  const [cardText, setCardText] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const cashKurus = parseMoneyInput(cashText);
  const cardKurus = parseMoneyInput(cardText);
  const totalKurus = cashKurus + cardKurus;

  const handleSave = async () => {
    if (createMut.isPending) return;
    if (!cashText.trim() && !cardText.trim()) {
      setError('Nakit veya kart tutarı girin (satış olmadıysa 0 yazın)');
      return;
    }
    setError('');
    try {
      const result = await createMut.mutateAsync({
        data: { businessDate: day, netCashKurus: cashKurus, netCardKurus: cardKurus, notes: notes.trim() || undefined },
      });
      await queryClient.invalidateQueries();
      router.replace(`/closing/${result.id}`);
    } catch (e) {
      setError(getErrorMessage(e, 'Kaydedilemedi'));
    }
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        {!!error && <Text style={s.error}>{error}</Text>}

        <Text style={s.label}>İş Günü</Text>
        <View style={s.dayRow}>
          <Pressable style={s.dayBtn} onPress={() => setDay(addDaysToDay(day, -1))} hitSlop={8} accessibilityLabel="Önceki gün">
            <Ionicons name="chevron-back" size={22} color={COLORS.text} />
          </Pressable>
          <View style={{ alignItems: 'center' }}>
            <Text style={s.dayText}>{formatDate(day)}</Text>
            <Text style={s.daySub}>{day === today ? 'Bugün' : getWeekdayName(day)}</Text>
          </View>
          <Pressable
            style={[s.dayBtn, day >= today && { opacity: 0.3 }]}
            disabled={day >= today}
            onPress={() => setDay(addDaysToDay(day, 1))}
            hitSlop={8}
            accessibilityLabel="Sonraki gün"
          >
            <Ionicons name="chevron-forward" size={22} color={COLORS.text} />
          </Pressable>
        </View>

        <Text style={s.label}>Nakit Ciro (₺)</Text>
        <TextInput style={s.input} value={cashText} onChangeText={setCashText} keyboardType="decimal-pad" placeholder="0,00" placeholderTextColor={COLORS.textMuted} />

        <Text style={s.label}>Kart Ciro (₺)</Text>
        <TextInput style={s.input} value={cardText} onChangeText={setCardText} keyboardType="decimal-pad" placeholder="0,00" placeholderTextColor={COLORS.textMuted} />

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
  dayRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder, borderRadius: RADIUS.md, padding: SPACING.sm },
  dayBtn: { padding: SPACING.sm },
  dayText: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  daySub: { color: COLORS.textSecondary, fontSize: 13 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.lg, paddingVertical: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.surfaceBorder },
  totalLabel: { color: COLORS.textSecondary, fontSize: 16 },
  totalValue: { color: COLORS.accent, fontSize: 22, fontWeight: '800' },
});
