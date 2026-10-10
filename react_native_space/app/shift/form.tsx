import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useShiftsControllerCreate, useShiftsControllerUpdate, useShiftsControllerRemove, useStaffControllerFindAll, useShiftTemplatesControllerFindAll } from '@/src/api/generated/api';
import { GradientButton } from '@/src/components/GradientButton';
import { Chip } from '@/src/components/Chip';
import { DayStepper } from '@/src/components/DayStepper';
import { getErrorMessage } from '@/src/api/customFetch';
import { istanbulToday } from '@/src/utils/format';
import { normalizeTime, confirmAction } from '@/src/utils/team';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';

/** "10:00" → "10", "16:30" → "16.30" (hazır saat düğmelerinde kısa gösterim) */
function shortTime(t: string, isEnd = false): string {
  if (isEnd && t === '00:00') return '24';
  const [h, m] = t.split(':');
  return m === '00' ? String(Number(h)) : `${Number(h)}.${m}`;
}

export default function ShiftFormScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ id?: string; staffId?: string; date?: string; start?: string; end?: string; notes?: string }>();
  const id = typeof params?.id === 'string' ? params.id : '';
  const isEdit = !!id;
  const validDate = typeof params?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(params.date) ? params.date : istanbulToday();

  const { data: staffData } = useStaffControllerFindAll({ includeInactive: false });
  const staff = staffData?.items ?? [];
  // Hazır saatler sunucuda tutulur; "Düzenle" ile değiştirilebilir (tüm telefonlarda aynı)
  const { data: templateData } = useShiftTemplatesControllerFindAll();
  const presets = (templateData?.items ?? []).map((t) => ({
    label: `${t.name} ${shortTime(t.startTime)}–${shortTime(t.endTime, true)}`,
    start: t.startTime,
    end: t.endTime,
  }));
  const createMut = useShiftsControllerCreate();
  const updateMut = useShiftsControllerUpdate();
  const removeMut = useShiftsControllerRemove();

  const [staffId, setStaffId] = useState(typeof params?.staffId === 'string' ? params.staffId : '');
  const [day, setDay] = useState(validDate);
  const [start, setStart] = useState(typeof params?.start === 'string' ? params.start : '');
  const [end, setEnd] = useState(typeof params?.end === 'string' ? params.end : '');
  const [notes, setNotes] = useState(typeof params?.notes === 'string' ? params.notes : '');
  const [error, setError] = useState('');

  const saving = createMut.isPending || updateMut.isPending || removeMut.isPending;

  const handleSave = async () => {
    if (saving) return;
    if (!staffId) return setError('Personel seçin');
    const st = normalizeTime(start);
    const en = normalizeTime(end);
    if (!st || !en) return setError('Saatleri girin (örn. 10:00 ve 18:00)');
    if (st === en) return setError('Başlangıç ve bitiş saati aynı olamaz');
    setError('');
    try {
      if (isEdit) {
        await updateMut.mutateAsync({ id, data: { staffId, businessDate: day, startTime: st, endTime: en, notes: notes.trim() || null } });
      } else {
        await createMut.mutateAsync({ data: { staffId, businessDate: day, startTime: st, endTime: en, notes: notes.trim() || undefined } });
      }
      await queryClient.invalidateQueries();
      router.back();
    } catch (e) {
      setError(getErrorMessage(e, 'Kaydedilemedi'));
    }
  };

  const handleDelete = () =>
    confirmAction('Vardiyayı sil', 'Bu vardiya silinsin mi?', 'Sil', async () => {
      try {
        await removeMut.mutateAsync({ id });
        await queryClient.invalidateQueries();
        router.back();
      } catch (e) {
        setError(getErrorMessage(e, 'Silinemedi'));
      }
    });

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        {!!error && <Text style={s.error}>{error}</Text>}

        <Text style={s.label}>Personel</Text>
        {staff.length === 0 ? (
          <Pressable onPress={() => router.push('/staff/form')}>
            <Text style={s.link}>Önce personel ekleyin →</Text>
          </Pressable>
        ) : (
          <View style={s.chips}>
            {staff.map((p) => (
              <Chip key={p.id} label={p?.name ?? ''} selected={staffId === p.id} onPress={() => setStaffId(p.id)} />
            ))}
          </View>
        )}

        <Text style={s.label}>Gün</Text>
        <DayStepper value={day} onChange={setDay} />

        <View style={s.labelRow}>
          <Text style={s.label}>Hazır Saatler</Text>
          <Pressable onPress={() => router.push('/shift/templates')} hitSlop={10} accessibilityLabel="Hazır saatleri düzenle">
            <Text style={s.editLink}>Düzenle</Text>
          </Pressable>
        </View>
        <View style={s.chips}>
          {presets.length === 0 && <Text style={s.hint}>Hazır saat yok — "Düzenle" ile ekleyin.</Text>}
          {presets.map((p) => (
            <Chip key={p.label} label={p.label} selected={start === p.start && end === p.end} onPress={() => { setStart(p.start); setEnd(p.end); }} />
          ))}
        </View>

        <View style={s.timeRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.label}>Giriş</Text>
            <TextInput style={s.input} value={start} onChangeText={setStart} onBlur={() => setStart(normalizeTime(start) ?? start)} placeholder="10:00" placeholderTextColor={COLORS.textMuted} keyboardType="numbers-and-punctuation" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.label}>Çıkış</Text>
            <TextInput style={s.input} value={end} onChangeText={setEnd} onBlur={() => setEnd(normalizeTime(end) ?? end)} placeholder="18:00" placeholderTextColor={COLORS.textMuted} keyboardType="numbers-and-punctuation" />
          </View>
        </View>
        <Text style={s.hint}>Gece yarısını geçen vardiya da olur (örn. 18:00 – 02:00).</Text>

        <Text style={s.label}>Not</Text>
        <TextInput style={s.input} value={notes} onChangeText={setNotes} placeholder="İsteğe bağlı" placeholderTextColor={COLORS.textMuted} />

        <GradientButton title="Kaydet" onPress={handleSave} loading={createMut.isPending || updateMut.isPending} style={{ marginTop: SPACING.lg }} />
        {isEdit && (
          <Pressable style={s.deleteBtn} onPress={handleDelete} accessibilityLabel="Vardiyayı sil">
            <Text style={s.deleteText}>Vardiyayı Sil</Text>
          </Pressable>
        )}
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
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  editLink: { color: COLORS.accent, fontSize: 15, fontWeight: '600', paddingBottom: SPACING.xs },
  link: { color: COLORS.accent, fontSize: 15, fontWeight: '600', paddingVertical: SPACING.sm },
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder, borderRadius: RADIUS.md, color: COLORS.text, fontSize: 16, paddingHorizontal: SPACING.md, height: 48 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  timeRow: { flexDirection: 'row', gap: SPACING.md },
  deleteBtn: { alignItems: 'center', paddingVertical: SPACING.md, marginTop: SPACING.sm },
  deleteText: { color: COLORS.error, fontSize: 16, fontWeight: '600' },
});
