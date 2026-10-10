import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useStaffControllerCreate, useStaffControllerFindOne, useStaffControllerUpdate } from '@/src/api/generated/api';
import { GradientButton } from '@/src/components/GradientButton';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { Chip } from '@/src/components/Chip';
import { getErrorMessage } from '@/src/api/customFetch';
import { parseMoneyInput } from '@/src/utils/format';
import { WAGE_PERIOD_LABELS } from '@/src/utils/team';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';

type Period = 'gunluk' | 'haftalik' | 'aylik';

function kurusToInput(k: number | null | undefined): string {
  if (k == null) return '';
  return (k / 100).toFixed(2).replace('.', ',').replace(/,00$/, '');
}

export default function StaffFormScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id = '' } = useLocalSearchParams<{ id?: string }>();
  const isEdit = !!id;
  const { data: existing, isLoading } = useStaffControllerFindOne(id, { query: { enabled: isEdit } });
  const createMut = useStaffControllerCreate();
  const updateMut = useStaffControllerUpdate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [period, setPeriod] = useState<Period>('haftalik');
  const [wageText, setWageText] = useState('');
  const [active, setActive] = useState(true);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isEdit && existing && !loaded) {
      setName(existing?.name ?? '');
      setPhone(existing?.phone ?? '');
      setPeriod((existing?.wagePeriod as Period) ?? 'haftalik');
      setWageText(kurusToInput(existing?.wageKurus));
      setActive(existing?.active ?? true);
      setLoaded(true);
    }
  }, [isEdit, existing, loaded]);

  const saving = createMut.isPending || updateMut.isPending;

  const handleSave = async () => {
    if (saving) return;
    if (!name.trim()) {
      setError('Ad soyad girin');
      return;
    }
    setError('');
    const wageKurus = wageText.trim() ? parseMoneyInput(wageText) : null;
    try {
      if (isEdit) {
        await updateMut.mutateAsync({ id, data: { name: name.trim(), phone: phone.trim() || null, wagePeriod: period, wageKurus, active } });
      } else {
        await createMut.mutateAsync({ data: { name: name.trim(), phone: phone.trim() || undefined, wagePeriod: period, wageKurus } });
      }
      await queryClient.invalidateQueries();
      router.back();
    } catch (e) {
      setError(getErrorMessage(e, 'Kaydedilemedi'));
    }
  };

  if (isEdit && isLoading) return <LoadingScreen />;

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        {!!error && <Text style={s.error}>{error}</Text>}

        <Text style={s.label}>Ad Soyad</Text>
        <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Örn. Ayşe Yılmaz" placeholderTextColor={COLORS.textMuted} />

        <Text style={s.label}>Telefon</Text>
        <TextInput style={s.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="İsteğe bağlı" placeholderTextColor={COLORS.textMuted} />

        <Text style={s.label}>Maaş Ödeme Şekli</Text>
        <View style={s.chips}>
          {(['gunluk', 'haftalik', 'aylik'] as Period[]).map((p) => (
            <Chip key={p} label={WAGE_PERIOD_LABELS[p] ?? p} selected={period === p} onPress={() => setPeriod(p)} />
          ))}
        </View>

        <Text style={s.label}>{WAGE_PERIOD_LABELS[period]} Ücret (₺)</Text>
        <TextInput style={s.input} value={wageText} onChangeText={setWageText} keyboardType="decimal-pad" placeholder="Örn. 3500" placeholderTextColor={COLORS.textMuted} />
        <Text style={s.hint}>Maaş öderken bu tutar otomatik yazılır, istersen değiştirirsin.</Text>

        {isEdit && (
          <View style={s.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.switchLabel}>Çalışıyor</Text>
              <Text style={s.hint}>İşten ayrıldıysa kapat. Geçmiş vardiya ve maaş kayıtları silinmez.</Text>
            </View>
            <Switch value={active} onValueChange={setActive} trackColor={{ true: COLORS.primary, false: COLORS.surfaceBorder }} thumbColor={active ? COLORS.accent : COLORS.textMuted} />
          </View>
        )}

        <GradientButton title="Kaydet" onPress={handleSave} loading={saving} style={{ marginTop: SPACING.lg }} />
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
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder, borderRadius: RADIUS.md, color: COLORS.text, fontSize: 16, paddingHorizontal: SPACING.md, height: 48 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginTop: SPACING.lg, padding: SPACING.md, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.surfaceBorder },
  switchLabel: { color: COLORS.text, fontSize: 16, fontWeight: '600' },
});
