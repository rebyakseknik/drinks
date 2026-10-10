import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) {
  return (
    <Pressable
      style={[s.chip, selected && s.chipOn]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      accessibilityLabel={label}
    >
      <Text style={[s.text, selected && s.textOn]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  chip: {
    minHeight: 40,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    backgroundColor: COLORS.surface,
  },
  chipOn: { backgroundColor: COLORS.primary, borderColor: COLORS.accent },
  text: { color: COLORS.textSecondary, fontSize: 15 },
  textOn: { color: COLORS.text, fontWeight: '700' },
});
