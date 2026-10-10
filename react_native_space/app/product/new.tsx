import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useProductsControllerCreate } from '@/src/api/generated/api';
import { GradientButton } from '@/src/components/GradientButton';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { getErrorMessage } from '@/src/api/customFetch';
import { Picker } from '@react-native-picker/picker';

export default function NewProductScreen() {
  const router = useRouter();
  const createMut = useProductsControllerCreate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [baseUnit, setBaseUnit] = useState('adet');
  const [threshold, setThreshold] = useState('0');
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!name.trim() || !category.trim()) { setError('Ad ve kategori gereklidir'); return; }
    setError('');
    try {
      const result = await createMut.mutateAsync({ data: { name: name.trim(), category: category.trim(), baseUnit, minStockThreshold: parseInt(threshold) || 0 } });
      router.replace(`/product/${result.id}`);
    } catch (e) {
      setError(getErrorMessage(e, 'Oluşturulamadı'));
    }
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        {!!error && <Text style={s.error}>{error}</Text>}
        <Text style={s.label}>Ürün Adı *</Text>
        <TextInput style={s.input} value={name} onChangeText={setName} placeholder="Örn: Su" placeholderTextColor={COLORS.textMuted} />

        <Text style={s.label}>Kategori *</Text>
        <TextInput style={s.input} value={category} onChangeText={setCategory} placeholder="Örn: İçecek" placeholderTextColor={COLORS.textMuted} />

        <Text style={s.label}>Temel Birim</Text>
        <View style={s.pickerWrap}>
          <Picker selectedValue={baseUnit} onValueChange={setBaseUnit} style={s.picker} dropdownIconColor={COLORS.text}>
            <Picker.Item label="Adet" value="adet" color={COLORS.text} />
            <Picker.Item label="Gram" value="gram" color={COLORS.text} />
            <Picker.Item label="Mililitre" value="mililitre" color={COLORS.text} />
          </Picker>
        </View>

        <Text style={s.label}>Minimum Stok Eşiği</Text>
        <TextInput style={s.input} value={threshold} onChangeText={setThreshold} keyboardType="numeric" placeholder="0" placeholderTextColor={COLORS.textMuted} />

        <GradientButton title="Oluştur" onPress={handleCreate} loading={createMut.isPending} style={{ marginTop: SPACING.lg }} />
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
  pickerWrap: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder, borderRadius: RADIUS.md, overflow: 'hidden' },
  picker: { color: COLORS.text, height: 48 },
});
