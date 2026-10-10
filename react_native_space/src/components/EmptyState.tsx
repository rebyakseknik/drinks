import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/src/utils/theme';
import { Ionicons } from '@expo/vector-icons';

export function EmptyState({ message, icon }: { message: string; icon?: string }) {
  return (
    <View style={s.c}>
      <Ionicons name={(icon as any) ?? 'file-tray-outline'} size={48} color={COLORS.textMuted} />
      <Text style={s.t}>{message}</Text>
    </View>
  );
}
const s = StyleSheet.create({
  c: { alignItems: 'center', justifyContent: 'center', padding: SPACING.xxl },
  t: { color: COLORS.textMuted, fontSize: 15, marginTop: SPACING.md, textAlign: 'center' },
});
