import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDate, getWeekdayName, addDaysToDay, istanbulToday } from '@/src/utils/format';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';

/** ◀ gün ▶ seçici. Ortaya basınca bugüne döner. */
export function DayStepper({ value, onChange }: { value: string; onChange: (day: string) => void }) {
  const today = istanbulToday();
  return (
    <View style={s.bar}>
      <Pressable style={s.arrow} onPress={() => onChange(addDaysToDay(value, -1))} accessibilityLabel="Önceki gün">
        <Ionicons name="chevron-back" size={22} color={COLORS.text} />
      </Pressable>
      <Pressable style={s.mid} onPress={() => onChange(today)} accessibilityLabel="Bugün">
        <Text style={s.title}>{value === today ? 'Bugün' : getWeekdayName(value)}</Text>
        <Text style={s.sub}>{formatDate(value)}</Text>
      </Pressable>
      <Pressable style={s.arrow} onPress={() => onChange(addDaysToDay(value, 1))} accessibilityLabel="Sonraki gün">
        <Ionicons name="chevron-forward" size={22} color={COLORS.text} />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.surfaceBorder },
  arrow: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  mid: { flex: 1, alignItems: 'center' },
  title: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  sub: { color: COLORS.textSecondary, fontSize: 13 },
});
