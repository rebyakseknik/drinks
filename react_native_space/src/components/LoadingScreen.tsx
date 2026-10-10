import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '@/src/utils/theme';

export function LoadingScreen() {
  return (
    <View style={s.c}>
      <ActivityIndicator size="large" color={COLORS.accent} />
    </View>
  );
}
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' } });
