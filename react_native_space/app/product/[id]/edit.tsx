import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Switch, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProductsControllerFindOne, useProductsControllerUpdate } from '@/src/api/generated/api';
import { GradientButton } from '@/src/components/GradientButton';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { getErrorMessage } from '@/src/api/customFetch';

export default function EditProductScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const product = useProductsControllerFindOne(id, { query: { enabled: !!id } });
  const updateMut = useProductsControllerUpdate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [threshold, setThreshold] = useState('0');
  const [active, setActive] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product.data) {
      setName(product.data.name ?? '');
      setCategory(product.data.category ?? '');
      setThreshold(String(product.data.minStockThreshold ?? 0));
      setActive(product.data.active ?? true);
    }
  }, [product.data]);

  if (product.isLoading) return <LoadingScreen />;

  const handleSave = async () => {
    setError('');
    try {
      await updateMut.mutateAsync({ id, data: { name: name.trim(), category: category.trim(), minStockThreshold: parseInt(threshold) || 0, active } });
      router.back();
    } catch (e) {
      setError(getErrorMessage(e, 'Güncellenemedi'));
    }
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={s.container} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        {!!error && <Text style={s.error}>{error}</Text>}
        <Text style={s.label}>Ürün Adı</Text>
        <TextInput style={s.input} value={name} onChangeText={setName} />
        <Text style={s.label}>Kategori</Text>
        <TextInput style={s.input} value={category} onChangeText={setCategory} />
        <Text style={s.label}>Min. Stok Eşiği</Text>
        <TextInput style={s.input} value={threshold} onChangeText={setThreshold} keyboardType="numeric" />
        <View style={s.switchRow}>
          <Text style={s.label}>Aktif</Text>
          <Switch value={active} onValueChange={setActive} trackColor={{ true: COLORS.primary }} />
        </View>
        <GradientButton title="Kaydet" onPress={handleSave} loading={updateMut.isPending} style={{ marginTop: SPACING.lg }} />
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
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.md },
});
