import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert, Platform } from 'react-native';
import { useSettingsControllerGet, useSettingsControllerUpdate } from '@/src/api/generated/api';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { GradientButton } from '@/src/components/GradientButton';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { getErrorMessage } from '@/src/api/customFetch';

export default function BusinessSettingsScreen() {
  const { data, isLoading, refetch } = useSettingsControllerGet();
  const updateMutation = useSettingsControllerUpdate();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (data) {
      setName(data?.name ?? '');
      setLocation(data?.location ?? '');
    }
  }, [data]);

  const handleSave = () => {
    updateMutation.mutate(
      { data: { name, location } },
      {
        onSuccess: () => {
          if (Platform.OS === 'web') alert('İşletme bilgileri güncellendi');
          else Alert.alert('Başarılı', 'İşletme bilgileri güncellendi');
          refetch();
        },
        onError: (e) => {
          const msg = getErrorMessage(e, 'Güncelleme başarısız');
          if (Platform.OS === 'web') alert(msg);
          else Alert.alert('Hata', msg);
        },
      },
    );
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.label}>İşletme Adı</Text>
      <TextInput
        style={s.input}
        value={name}
        onChangeText={setName}
        placeholder="İşletme adı"
        placeholderTextColor={COLORS.textMuted}
      />

      <Text style={s.label}>Konum</Text>
      <TextInput
        style={s.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Konum"
        placeholderTextColor={COLORS.textMuted}
      />

      <GradientButton
        title="Kaydet"
        onPress={handleSave}
        loading={updateMutation?.isPending}
        style={{ marginTop: SPACING.lg }}
      />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md },
  label: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 4, marginTop: SPACING.md },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
});
