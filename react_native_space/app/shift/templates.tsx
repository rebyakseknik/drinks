import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import {
  useShiftTemplatesControllerFindAll,
  useShiftTemplatesControllerCreate,
  useShiftTemplatesControllerUpdate,
  useShiftTemplatesControllerRemove,
} from '@/src/api/generated/api';
import type { ShiftTemplateResponseDto } from '@/src/api/generated/schemas';
import { GradientButton } from '@/src/components/GradientButton';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { getErrorMessage } from '@/src/api/customFetch';
import { normalizeTime, confirmAction, formatHours } from '@/src/utils/team';
import { COLORS, SPACING, RADIUS, TOUCH } from '@/src/utils/theme';

/** Vardiya süresi (dakika); bitiş başlangıçtan önceyse gece yarısını geçer. */
function minutesBetween(start: string, end: string): number {
  const toM = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  const d = toM(end) - toM(start);
  return d > 0 ? d : d + 24 * 60;
}

type Editing = { id: string | null; name: string; start: string; end: string };

/** Vardiya formundaki "Hazır Saatler" düğmelerini düzenleme ekranı. */
export default function ShiftTemplatesScreen() {
  const queryClient = useQueryClient();
  const list = useShiftTemplatesControllerFindAll();
  const createMut = useShiftTemplatesControllerCreate();
  const updateMut = useShiftTemplatesControllerUpdate();
  const removeMut = useShiftTemplatesControllerRemove();
  const [editing, setEditing] = useState<Editing | null>(null);
  const [error, setError] = useState('');

  const saving = createMut.isPending || updateMut.isPending || removeMut.isPending;
  const items = list.data?.items ?? [];

  const startEdit = (t?: ShiftTemplateResponseDto) => {
    setError('');
    setEditing(t ? { id: t.id, name: t.name, start: t.startTime, end: t.endTime } : { id: null, name: '', start: '', end: '' });
  };

  const handleSave = async () => {
    if (!editing || saving) return;
    const name = editing.name.trim();
    const st = normalizeTime(editing.start);
    const en = normalizeTime(editing.end);
    if (!name) return setError('Ad girin (örn. Sabah)');
    if (!st || !en) return setError('Saatleri girin (örn. 10:00 ve 18:00)');
    if (st === en) return setError('Başlangıç ve bitiş saati aynı olamaz');
    setError('');
    try {
      if (editing.id) {
        await updateMut.mutateAsync({ id: editing.id, data: { name, startTime: st, endTime: en } });
      } else {
        await createMut.mutateAsync({ data: { name, startTime: st, endTime: en } });
      }
      await queryClient.invalidateQueries();
      setEditing(null);
    } catch (e) {
      setError(getErrorMessage(e, 'Kaydedilemedi'));
    }
  };

  const handleDelete = () => {
    if (!editing?.id) return;
    const id = editing.id;
    confirmAction('Hazır saati sil', `"${editing.name}" silinsin mi? Girilmiş vardiyalar etkilenmez.`, 'Sil', async () => {
      try {
        await removeMut.mutateAsync({ id });
        await queryClient.invalidateQueries();
        setEditing(null);
      } catch (e) {
        setError(getErrorMessage(e, 'Silinemedi'));
      }
    });
  };

  if (list.isLoading) return <LoadingScreen />;

  const previewStart = editing ? normalizeTime(editing.start) : null;
  const previewEnd = editing ? normalizeTime(editing.end) : null;

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <ScrollView style={s.flex} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <Text style={s.intro}>Vardiya girerken kullanılan hazır saatler. Değişiklik yalnızca bundan sonraki girişleri etkiler.</Text>

        {editing && (
          <View style={s.editor}>
            <Text style={s.editorTitle}>{editing.id ? 'Hazır saati düzenle' : 'Yeni hazır saat'}</Text>
            <Text style={s.label}>Ad</Text>
            <TextInput
              style={s.input}
              value={editing.name}
              onChangeText={(v) => setEditing({ ...editing, name: v })}
              placeholder="Örn. Sabah"
              placeholderTextColor={COLORS.textMuted}
              autoFocus={!editing.id}
              maxLength={40}
            />
            <View style={s.timeRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>Giriş</Text>
                <TextInput
                  style={s.input}
                  value={editing.start}
                  onChangeText={(v) => setEditing({ ...editing, start: v })}
                  onBlur={() => setEditing({ ...editing, start: normalizeTime(editing.start) ?? editing.start })}
                  placeholder="10:00"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>Çıkış</Text>
                <TextInput
                  style={s.input}
                  value={editing.end}
                  onChangeText={(v) => setEditing({ ...editing, end: v })}
                  onBlur={() => setEditing({ ...editing, end: normalizeTime(editing.end) ?? editing.end })}
                  placeholder="18:00"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
            </View>
            {previewStart && previewEnd && previewStart !== previewEnd && (
              <Text style={s.preview}>
                {previewStart}–{previewEnd} · {formatHours(minutesBetween(previewStart, previewEnd))}
                {minutesBetween(previewStart, previewEnd) + Number(previewStart.slice(0, 2)) * 60 > 24 * 60 ? ' · gece yarısını geçer' : ''}
              </Text>
            )}
            {!!error && <Text style={s.error}>{error}</Text>}
            <GradientButton title="Kaydet" onPress={handleSave} loading={createMut.isPending || updateMut.isPending} style={{ marginTop: SPACING.md }} />
            <View style={s.editorActions}>
              <Pressable style={s.textBtn} onPress={() => { setEditing(null); setError(''); }}>
                <Text style={s.cancelText}>Vazgeç</Text>
              </Pressable>
              {editing.id && (
                <Pressable style={s.textBtn} onPress={handleDelete}>
                  <Text style={s.deleteText}>Sil</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}

        {items.map((t) => (
          <Pressable
            key={t.id}
            style={[s.row, editing?.id === t.id && s.rowActive]}
            onPress={() => startEdit(t)}
            accessibilityLabel={`${t.name} düzenle`}
          >
            <View style={{ flex: 1 }}>
              <Text style={s.rowName}>{t.name}</Text>
              <Text style={s.rowTime}>
                {t.startTime}–{t.endTime} · {formatHours(minutesBetween(t.startTime, t.endTime))}
              </Text>
            </View>
            <Ionicons name="create-outline" size={22} color={COLORS.accent} />
          </Pressable>
        ))}
        {items.length === 0 && !editing && <Text style={s.empty}>Hazır saat yok.</Text>}

        {!editing && (
          <Pressable style={s.addBtn} onPress={() => startEdit()} accessibilityLabel="Yeni hazır saat ekle">
            <Ionicons name="add-circle" size={22} color={COLORS.accent} />
            <Text style={s.addText}>Yeni hazır saat ekle</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  intro: { color: COLORS.textSecondary, fontSize: 15, marginBottom: SPACING.md },
  editor: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.accent,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  editorTitle: { color: COLORS.accent, fontSize: 17, fontWeight: '700' },
  label: { color: COLORS.textSecondary, fontSize: 15, marginTop: SPACING.md, marginBottom: SPACING.xs },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: RADIUS.md,
    color: COLORS.text,
    fontSize: 17,
    paddingHorizontal: SPACING.md,
    height: TOUCH,
  },
  timeRow: { flexDirection: 'row', gap: SPACING.md },
  preview: { color: COLORS.success, fontSize: 15, fontWeight: '600', marginTop: SPACING.sm },
  error: { color: COLORS.error, fontSize: 15, marginTop: SPACING.sm },
  editorActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.xs },
  textBtn: { minHeight: TOUCH, justifyContent: 'center', paddingHorizontal: SPACING.sm },
  cancelText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600' },
  deleteText: { color: COLORS.error, fontSize: 16, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    minHeight: 60,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  rowActive: { borderColor: COLORS.accent },
  rowName: { color: COLORS.text, fontSize: 17, fontWeight: '700' },
  rowTime: { color: COLORS.textSecondary, fontSize: 15, marginTop: 2 },
  empty: { color: COLORS.textMuted, fontSize: 15, marginBottom: SPACING.md },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    minHeight: TOUCH,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.accent,
    marginTop: SPACING.xs,
  },
  addText: { color: COLORS.accent, fontSize: 16, fontWeight: '700' },
});
