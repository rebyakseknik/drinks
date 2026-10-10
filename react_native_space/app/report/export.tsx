import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Alert } from 'react-native';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { GradientButton } from '@/src/components/GradientButton';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ExportScreen() {
  const [type, setType] = useState('revenue');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const from = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)).toISOString();
      const to = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0)).toISOString();

      const token = await AsyncStorage.getItem('auth_token');
      const baseUrl = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/$/, '');
      const url = `${baseUrl}/api/reports/export?type=${type}&from=${from}&to=${to}`;

      if (Platform.OS === 'web') {
        const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const blob = await resp.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `rapor-${type}.csv`;
        a.click();
      } else {
        Alert.alert('Bilgi', 'CSV dosyası web önizlemede indirilebilir.');
      }
    } catch (e) {
      const msg = 'Dışa aktarma başarısız';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Hata', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.label}>Rapor Türü</Text>
      <View style={s.pickerWrap}>
        <Picker selectedValue={type} onValueChange={setType} style={s.picker} dropdownIconColor={COLORS.text}>
          <Picker.Item label="Ciro" value="revenue" color={COLORS.text} />
          <Picker.Item label="Stok Hareketleri" value="movements" color={COLORS.text} />
          <Picker.Item label="Sevkiyatlar" value="dispatches" color={COLORS.text} />
        </Picker>
      </View>

      <GradientButton title="Dışa Aktar" onPress={handleExport} loading={loading} style={{ marginTop: SPACING.xl }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md },
  label: { color: COLORS.textSecondary, fontSize: 14, marginBottom: SPACING.xs, marginTop: SPACING.md },
  pickerWrap: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder, borderRadius: RADIUS.md, overflow: 'hidden' },
  picker: { color: COLORS.text, height: 48 },
});
