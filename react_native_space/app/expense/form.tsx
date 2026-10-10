import React, { useMemo, useState } from 'react';
import * as Crypto from 'expo-crypto';
import { View, Text, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useExpensesControllerCreate, useStaffControllerFindAll } from '@/src/api/generated/api';
import type { StaffResponseDto } from '@/src/api/generated/schemas';
import { GradientButton } from '@/src/components/GradientButton';
import { Chip } from '@/src/components/Chip';
import { DayStepper } from '@/src/components/DayStepper';
import { getErrorMessage } from '@/src/api/customFetch';
import { istanbulToday, parseMoneyInput, formatMoney } from '@/src/utils/format';
import { EXPENSE_CATEGORY_LABELS, WAGE_PERIOD_LABELS } from '@/src/utils/team';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';

type Category = 'personel_maasi' | 'kira' | 'fatura' | 'malzeme' | 'diger';
const CATEGORIES: Category[] = ['personel_maasi', 'kira', 'fatura', 'malzeme', 'diger'];

function kurusToInput(k: number | null | undefined): string {
  if (k == null) return '';
  return (k / 100).toFixed(2).replace('.', ',').replace(/,00$/, '');
}

export default function ExpenseFormScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createMut = useExpensesControllerCreate();
  const { data: staffData } = useStaffControllerFindAll({ includeInactive: false });
  const staff = staffData?.items ?? [];

  const [day, setDay] = useState(istanbulToday());
  const [category, setCategory] = useState<Category | ''>('');
  const [staffId, setStaffId] = useState('');
  const [amountText, setAmountText] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const isSalary = category === 'personel_maasi';

  // Çift kayıt koruması: aynı form içeriği için aynı anahtar (bağlantı koparsa tekrar denemek güvenli)
  const signature = JSON.stringify({ day, category, staffId, amountText, description });
  const idempotencyKey = useMemo(() => Crypto.randomUUID(), [signature]);

  const pickStaff = (p: StaffResponseDto) => {
    setStaffId(p.id);
    if (p?.wageKurus != null) setAmountText(kurusToInput(p.wageKurus));
  };

  const handleSave = async () => {
    if (createMut.isPending) return;
    if (!category) return setError('Gider türünü seçin');
    if (isSalary && !staffId) return setError('Maaşı ödenen personeli seçin');
    const amountKurus = parseMoneyInput(amountText);
    if (amountKurus <= 0) return setError('Tutar girin');
    setError('');
    try {
      await createMut.mutateAsync({
        data: { expenseDate: day, category, amountKurus, staffId: isSalary ? staffId : undefined, description: description.trim() || undefined, idempotencyKey },
      });
      await queryClient.invalidateQueries();
      router.back();
    } catch (e) {
      setError(getErrorMessage(e, 'Kaydedilemedi'));
    }
  };

  const selectedStaff = staff.find((p) => p.id === staffId);

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        {!!error && <Text style={s.error}>{error}</Text>}

        <Text style={s.label}>Gider Türü</Text>
        <View style={s.chips}>
          {CATEGORIES.map((c) => (
            <Chip key={c} label={EXPENSE_CATEGORY_LABELS[c] ?? c} selected={category === c} onPress={() => setCategory(c)} />
          ))}
        </View>

        {isSalary && (
          <>
            <Text style={s.label}>Personel</Text>
            {staff.length === 0 ? (
              <Pressable onPress={() => router.push('/staff/form')}>
                <Text style={s.link}>Önce personel ekleyin →</Text>
              </Pressable>
            ) : (
              <View style={s.chips}>
                {staff.map((p) => (
                  <Chip key={p.id} label={p?.name ?? ''} selected={staffId === p.id} onPress={() => pickStaff(p)} />
                ))}
              </View>
            )}
            {selectedStaff?.wageKurus != null && (
              <Text style={s.hint}>{WAGE_PERIOD_LABELS[selectedStaff?.wagePeriod ?? ''] ?? ''} ücreti {formatMoney(selectedStaff.wageKurus)} — tutar otomatik yazıldı.</Text>
            )}
          </>
        )}

        <Text style={s.label}>Tutar (₺)</Text>
        <TextInput style={s.input} value={amountText} onChangeText={setAmountText} keyboardType="decimal-pad" placeholder="Örn. 2500" placeholderTextColor={COLORS.textMuted} />

        <Text style={s.label}>Tarih</Text>
        <DayStepper value={day} onChange={setDay} />

        <Text style={s.label}>Açıklama</Text>
        <TextInput style={s.input} value={description} onChangeText={setDescription} placeholder="İsteğe bağlı (örn. Ekim elektrik)" placeholderTextColor={COLORS.textMuted} />

        <GradientButton title="Kaydet" onPress={handleSave} loading={createMut.isPending} style={{ marginTop: SPACING.lg }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  error: { color: COLORS.error, fontSize: 14, marginBottom: SPACING.md },
  label: { color: COLORS.textSecondary, fontSize: 14, marginBottom: SPACING.xs, marginTop: SPACING.md },
  hint: { color: COLORS.textMuted, fontSize: 13, marginTop: SPACING.xs },
  link: { color: COLORS.accent, fontSize: 15, fontWeight: '600', paddingVertical: SPACING.sm },
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder, borderRadius: RADIUS.md, color: COLORS.text, fontSize: 16, paddingHorizontal: SPACING.md, height: 48 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
});
