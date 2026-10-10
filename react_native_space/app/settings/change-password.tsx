import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert, Platform } from 'react-native';
import { useAuthControllerChangePassword } from '@/src/api/generated/api';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { GradientButton } from '@/src/components/GradientButton';
import { getErrorMessage } from '@/src/api/customFetch';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const mutation = useAuthControllerChangePassword();

  const handleSubmit = () => {
    if (!currentPassword || !newPassword) {
      const msg = 'Tüm alanları doldurun';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Uyarı', msg);
      return;
    }
    if (newPassword !== confirmPassword) {
      const msg = 'Yeni şifreler eşleşmiyor';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Uyarı', msg);
      return;
    }
    if (newPassword?.length < 6) {
      const msg = 'Şifre en az 6 karakter olmalı';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Uyarı', msg);
      return;
    }
    mutation.mutate(
      { data: { currentPassword, newPassword } },
      {
        onSuccess: () => {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          if (Platform.OS === 'web') alert('Şifre başarıyla değiştirildi');
          else Alert.alert('Başarılı', 'Şifre başarıyla değiştirildi');
        },
        onError: (e) => {
          const msg = getErrorMessage(e, 'Şifre değiştirme başarısız');
          if (Platform.OS === 'web') alert(msg);
          else Alert.alert('Hata', msg);
        },
      },
    );
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.label}>Mevcut Şifre</Text>
      <TextInput
        style={s.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        placeholder="Mevcut şifreniz"
        placeholderTextColor={COLORS.textMuted}
      />

      <Text style={s.label}>Yeni Şifre</Text>
      <TextInput
        style={s.input}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        placeholder="Yeni şifre"
        placeholderTextColor={COLORS.textMuted}
      />

      <Text style={s.label}>Yeni Şifre (Tekrar)</Text>
      <TextInput
        style={s.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholder="Yeni şifreyi onaylayın"
        placeholderTextColor={COLORS.textMuted}
      />

      <GradientButton
        title="Şifreyi Değiştir"
        onPress={handleSubmit}
        loading={mutation?.isPending}
        style={{ marginTop: SPACING.xl }}
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
