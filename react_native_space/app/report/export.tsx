import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, Alert, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { COLORS, SPACING, RADIUS, PICKER_STYLE } from '@/src/utils/theme';
import { GradientButton } from '@/src/components/GradientButton';
import { BASE_URL, getAuthToken } from '@/src/api/customFetch';
import { getMonthName, istanbulToday } from '@/src/utils/format';

function monthRange(year: number, month: number) {
  const from = new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10);
  const to = new Date(Date.UTC(year, month + 1, 0)).toISOString().slice(0, 10);
  return { from, to };
}

function showMessage(title: string, msg: string) {
  if (Platform.OS === 'web') alert(msg);
  else Alert.alert(title, msg);
}

export default function ExportScreen() {
  const today = istanbulToday();
  const [type, setType] = useState('revenue');
  const [year, setYear] = useState(Number(today.slice(0, 4)));
  const [month, setMonth] = useState(Number(today.slice(5, 7)) - 1);
  const [loading, setLoading] = useState(false);

  const isCurrentMonth = year === Number(today.slice(0, 4)) && month === Number(today.slice(5, 7)) - 1;
  const prevMonth = () => (month === 0 ? (setMonth(11), setYear(year - 1)) : setMonth(month - 1));
  const nextMonth = () => {
    if (isCurrentMonth) return;
    if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1);
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const { from, to } = monthRange(year, month);
      const url = `${BASE_URL}/api/reports/export?type=${type}&from=${from}&to=${to}`;
      const headers = { Authorization: `Bearer ${getAuthToken() ?? ''}` };
      const fileName = `drinks-${type === 'revenue' ? 'ciro' : type === 'dispatches' ? 'sevkiyat' : 'hareketler'}-${from.slice(0, 7)}.csv`;

      if (Platform.OS === 'web') {
        const resp = await fetch(url, { headers });
        if (!resp.ok) throw new Error(`Sunucu hatası (${resp.status})`);
        const blob = await resp.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.click();
        return;
      }

      // Telefonda: dosyayı indir, sonra paylaşım menüsünü aç (WhatsApp, E-posta, Dosyalar, iCloud…)
      const target = `${FileSystem.cacheDirectory}${fileName}`;
      const result = await FileSystem.downloadAsync(url, target, { headers });
      if (result.status !== 200) throw new Error(`Sunucu hatası (${result.status})`);
      if (!(await Sharing.isAvailableAsync())) throw new Error('Bu cihazda paylaşım kullanılamıyor');
      await Sharing.shareAsync(result.uri, {
        mimeType: 'text/csv',
        UTI: 'public.comma-separated-values-text',
        dialogTitle: 'CSV dosyasını paylaş',
      });
    } catch (e) {
      showMessage('Hata', `Dışa aktarma başarısız. ${e instanceof Error ? e.message : ''}`.trim());
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

      <Text style={s.label}>Dönem</Text>
      <View style={s.monthRow}>
        <Pressable onPress={prevMonth} style={s.navBtn} hitSlop={8} accessibilityLabel="Önceki ay">
          <Ionicons name="chevron-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={s.monthText}>{getMonthName(month)} {year}</Text>
        <Pressable onPress={nextMonth} style={[s.navBtn, isCurrentMonth && { opacity: 0.3 }]} disabled={isCurrentMonth} hitSlop={8} accessibilityLabel="Sonraki ay">
          <Ionicons name="chevron-forward" size={22} color={COLORS.text} />
        </Pressable>
      </View>

      <GradientButton title="Dışa Aktar" onPress={handleExport} loading={loading} style={{ marginTop: SPACING.xl }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md },
  label: { color: COLORS.textSecondary, fontSize: 14, marginBottom: SPACING.xs, marginTop: SPACING.md },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder, borderRadius: RADIUS.md, padding: SPACING.sm },
  navBtn: { padding: SPACING.sm },
  monthText: { color: COLORS.text, fontSize: 17, fontWeight: '700' },
  pickerWrap: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder, borderRadius: RADIUS.md, overflow: 'hidden' },
  picker: PICKER_STYLE,
});
