import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, TOUCH } from '@/src/utils/theme';
import type { UnitField } from '@/src/utils/quantity';

/**
 * Birimlere göre yan yana miktar alanları: [ 2 ] koli  [ 5 ] adet
 * Telefonda sayısal klavye açılır (kg/L için ondalıklı).
 */
export function QuantityFields({
  fields,
  values,
  onChange,
  invalid,
  autoFocus,
}: {
  fields: UnitField[];
  values: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  invalid?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <View style={s.row}>
      {fields.map((f, i) => (
        <View key={f.key} style={[s.box, invalid && s.boxInvalid]}>
          <TextInput
            style={s.input}
            value={values[f.key] ?? ''}
            onChangeText={(v) => onChange({ ...values, [f.key]: v })}
            keyboardType={f.decimals ? 'decimal-pad' : 'number-pad'}
            inputMode={f.decimals ? 'decimal' : 'numeric'}
            placeholder="0"
            placeholderTextColor={COLORS.textMuted}
            autoFocus={autoFocus && i === 0}
            selectTextOnFocus
            accessibilityLabel={f.label}
            returnKeyType="done"
          />
          <Text style={s.unit}>{f.label}</Text>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', gap: SPACING.sm },
  box: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TOUCH,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: RADIUS.md,
    paddingRight: SPACING.sm,
  },
  boxInvalid: { borderColor: COLORS.error },
  // minWidth/width: web'de giriş kutusunun taşıp birim yazısını gizlemesini önler
  input: { flex: 1, minWidth: 0, width: '100%', color: COLORS.text, fontSize: 18, fontWeight: '600', paddingHorizontal: SPACING.md, minHeight: TOUCH },
  unit: { color: COLORS.accent, fontSize: 16, fontWeight: '700', flexShrink: 0 },
});
