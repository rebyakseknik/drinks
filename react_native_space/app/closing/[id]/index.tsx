import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useClosingsControllerFindOne, useClosingsControllerUpdate } from '@/src/api/generated/api';
import { Card } from '@/src/components/Card';
import { GradientButton } from '@/src/components/GradientButton';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { formatMoney, formatDate, parseMoneyInput } from '@/src/utils/format';
import { getErrorMessage } from '@/src/api/customFetch';

export default function ClosingDetailScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const closing = useClosingsControllerFindOne(id, { query: { enabled: !!id } });
  const updateMut = useClosingsControllerUpdate();
  const [editing, setEditing] = useState(false);
  const [cashText, setCashText] = useState('');
  const [cardText, setCardText] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useFocusEffect(useCallback(() => { closing.refetch(); }, []));

  const c = closing.data;

  useEffect(() => {
    if (c) {
      setCashText(String((c.netCashKurus / 100).toFixed(2).replace('.', ',')));
      setCardText(String((c.netCardKurus / 100).toFixed(2).replace('.', ',')));
      setNotes(c.notes ?? '');
    }
  }, [c]);

  if (closing.isLoading) return <LoadingScreen />;
  if (!c) return <Text style={{ color: COLORS.error, padding: SPACING.md }}>Kapanış bulunamadı</Text>;

  const createdBy = c.createdBy as { id: string; name: string } | null;
  const cashKurus = parseMoneyInput(cashText);
  const cardKurus = parseMoneyInput(cardText);
  const totalKurus = cashKurus + cardKurus;

  const handleUpdate = async () => {
    setError('');
    try {
      await updateMut.mutateAsync({
        id,
        data: { netCashKurus: cashKurus, netCardKurus: cardKurus, notes: notes.trim(), version: c.version },
      });
      setEditing(false);
      closing.refetch();
    } catch (e) {
      setError(getErrorMessage(e, 'Güncellenemedi'));
    }
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={s.container} contentContainerStyle={s.content} refreshControl={<RefreshControl refreshing={closing.isLoading} onRefresh={() => closing.refetch()} tintColor={COLORS.accent} />} keyboardShouldPersistTaps="handled">
        <Card>
          <Text style={s.dateText}>{formatDate(c.businessDate)}</Text>
          <Text style={s.info}>Oluşturan: {createdBy?.name ?? '-'}</Text>
        </Card>

        {!!error && <Text style={s.error}>{error}</Text>}

        <Text style={s.label}>Nakit (₺)</Text>
        <TextInput style={s.input} value={cashText} onChangeText={setCashText} keyboardType="decimal-pad" editable={editing} />

        <Text style={s.label}>Kart (₺)</Text>
        <TextInput style={s.input} value={cardText} onChangeText={setCardText} keyboardType="decimal-pad" editable={editing} />

        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Toplam:</Text>
          <Text style={s.totalValue}>{formatMoney(totalKurus)}</Text>
        </View>

        <Text style={s.label}>Not</Text>
        <TextInput style={[s.input, { height: 80 }]} value={notes} onChangeText={setNotes} multiline editable={editing} />

        {editing ? (
          <GradientButton title="Kaydet" onPress={handleUpdate} loading={updateMut.isPending} style={{ marginTop: SPACING.lg }} />
        ) : (
          <GradientButton title="Düzenle" onPress={() => setEditing(true)} style={{ marginTop: SPACING.lg }} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { padding: SPACING.md },
  dateText: { color: COLORS.accent, fontSize: 20, fontWeight: '700' },
  info: { color: COLORS.textSecondary, fontSize: 14, marginTop: 2 },
  error: { color: COLORS.error, fontSize: 14, marginBottom: SPACING.md },
  label: { color: COLORS.textSecondary, fontSize: 14, marginBottom: SPACING.xs, marginTop: SPACING.md },
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder, borderRadius: RADIUS.md, color: COLORS.text, fontSize: 16, padding: SPACING.md, height: 48 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.lg, paddingVertical: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.surfaceBorder },
  totalLabel: { color: COLORS.textSecondary, fontSize: 16 },
  totalValue: { color: COLORS.accent, fontSize: 22, fontWeight: '800' },
});
