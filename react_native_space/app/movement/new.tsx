import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMovementsControllerCreate, useProductsControllerFindAll } from '@/src/api/generated/api';
import { GradientButton } from '@/src/components/GradientButton';
import { Card } from '@/src/components/Card';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { getErrorMessage } from '@/src/api/customFetch';
import { getMovementTypeLabel, getBaseUnitLabel } from '@/src/utils/format';
import { Ionicons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';
import { Picker } from '@react-native-picker/picker';
import type { MovementLineInputDto } from '@/src/api/generated/schemas';

interface LineItem {
  key: string;
  productId: string;
  productName: string;
  packageName: string;
  packageQuantity: string;
  conversionFactorUsed: number;
  baseUnit: string;
  notes: string;
  reason: string;
}

const TYPES = ['mal_kabul', 'sevkiyat', 'depoya_iade', 'fire_hasar', 'sayim_duzeltmesi'];

export default function NewMovementScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();
  const createMut = useMovementsControllerCreate();
  const products = useProductsControllerFindAll({ active: true });
  const [type, setType] = useState(params.type || 'sevkiyat');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<LineItem[]>([]);
  const [error, setError] = useState('');

  const allProducts = products.data?.items ?? [];

  const addLine = (productId: string) => {
    const prod = allProducts.find((p) => p.id === productId);
    if (!prod) return;
    setLines([...lines, {
      key: uuidv4(),
      productId: prod.id,
      productName: prod.name,
      packageName: prod.baseUnit,
      packageQuantity: '',
      conversionFactorUsed: 1,
      baseUnit: prod.baseUnit,
      notes: '',
      reason: '',
    }]);
  };

  const updateLine = (key: string, field: string, value: string | number) => {
    setLines(lines.map((l) => l.key === key ? { ...l, [field]: value } : l));
  };

  const removeLine = (key: string) => {
    setLines(lines.filter((l) => l.key !== key));
  };

  const handleSave = async () => {
    if (lines.length === 0) { setError('En az bir ürün ekleyin'); return; }
    for (const l of lines) {
      if (!l.packageQuantity || parseFloat(l.packageQuantity) <= 0) {
        setError('Tüm miktarlar 0\'dan büyük olmalıdır'); return;
      }
      if (type === 'sayim_duzeltmesi' && !l.reason.trim()) {
        setError('Sayım düzeltmesinde sebep zorunludur'); return;
      }
    }
    setError('');
    try {
      const lineData: MovementLineInputDto[] = lines.map((l) => ({
        productId: l.productId,
        packageName: l.packageName,
        packageQuantity: parseFloat(l.packageQuantity.replace(',', '.')),
        conversionFactorUsed: l.conversionFactorUsed,
        notes: l.notes || undefined,
        reason: l.reason || undefined,
      }));
      const result = await createMut.mutateAsync({
        data: {
          idempotencyKey: uuidv4(),
          documentDate: new Date().toISOString(),
          type,
          notes: notes || undefined,
          lines: lineData,
        },
      });
      router.replace(`/movement/${result.id}`);
    } catch (e) {
      setError(getErrorMessage(e, 'Kaydedilemedi'));
    }
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        {!!error && <Text style={s.error}>{error}</Text>}

        <Text style={s.label}>Hareket Türü</Text>
        <View style={s.pickerWrap}>
          <Picker selectedValue={type} onValueChange={setType} style={s.picker} dropdownIconColor={COLORS.text}>
            {TYPES.map((t) => <Picker.Item key={t} label={getMovementTypeLabel(t)} value={t} color={COLORS.text} />)}
          </Picker>
        </View>

        <Text style={s.label}>Not</Text>
        <TextInput style={s.input} value={notes} onChangeText={setNotes} placeholder="İsteğe bağlı" placeholderTextColor={COLORS.textMuted} />

        <Text style={s.sectionTitle}>Ürünler ({lines.length})</Text>

        {lines.map((line) => (
          <Card key={line.key}>
            <View style={s.lineHeader}>
              <Text style={s.lineName}>{line.productName}</Text>
              <Pressable onPress={() => removeLine(line.key)}>
                <Ionicons name="close-circle" size={22} color={COLORS.error} />
              </Pressable>
            </View>
            <Text style={s.label}>Miktar ({getBaseUnitLabel(line.baseUnit)})</Text>
            <TextInput
              style={s.input}
              value={line.packageQuantity}
              onChangeText={(v) => updateLine(line.key, 'packageQuantity', v)}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={COLORS.textMuted}
            />
            {parseFloat(line.packageQuantity?.replace(',', '.') || '0') > 0 && (
              <Text style={s.calcText}>
                = {Math.round(parseFloat(line.packageQuantity.replace(',', '.')) * line.conversionFactorUsed)} {getBaseUnitLabel(line.baseUnit)}
              </Text>
            )}
            {type === 'sayim_duzeltmesi' && (
              <>
                <Text style={s.label}>Sebep *</Text>
                <TextInput
                  style={s.input}
                  value={line.reason}
                  onChangeText={(v) => updateLine(line.key, 'reason', v)}
                  placeholder="Sebep girin"
                  placeholderTextColor={COLORS.textMuted}
                />
              </>
            )}
          </Card>
        ))}

        <Text style={s.label}>Ürün Ekle</Text>
        <View style={s.pickerWrap}>
          <Picker
            selectedValue=""
            onValueChange={(v) => { if (v) addLine(v); }}
            style={s.picker}
            dropdownIconColor={COLORS.text}
          >
            <Picker.Item label="Seçin..." value="" color={COLORS.textMuted} />
            {allProducts.map((p) => <Picker.Item key={p.id} label={p.name} value={p.id} color={COLORS.text} />)}
          </Picker>
        </View>

        <GradientButton title="Kaydet" onPress={handleSave} loading={createMut.isPending} disabled={lines.length === 0} style={{ marginTop: SPACING.lg }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  error: { color: COLORS.error, fontSize: 14, marginBottom: SPACING.md },
  label: { color: COLORS.textSecondary, fontSize: 14, marginBottom: SPACING.xs, marginTop: SPACING.md },
  input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder, borderRadius: RADIUS.md, color: COLORS.text, fontSize: 16, padding: SPACING.md, height: 48 },
  pickerWrap: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder, borderRadius: RADIUS.md, overflow: 'hidden' },
  picker: { color: COLORS.text, height: 48 },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginTop: SPACING.lg, marginBottom: SPACING.sm },
  lineHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lineName: { color: COLORS.accent, fontSize: 16, fontWeight: '600' },
  calcText: { color: COLORS.success, fontSize: 13, marginTop: SPACING.xs },
});
