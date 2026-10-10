import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'danger';
}

export function GradientButton({ title, onPress, loading, disabled, style, variant = 'primary' }: Props) {
  const bg = variant === 'danger' ? COLORS.error : COLORS.primary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        s.btn, { backgroundColor: bg, opacity: (disabled || loading) ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={s.text}>{title}</Text>}
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: { height: 52, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.lg },
  text: { color: COLORS.white, fontSize: 17, fontWeight: '700' },
});
