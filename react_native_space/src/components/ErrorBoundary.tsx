import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@/src/utils/theme';

interface Props { children: React.ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={s.container}>
          <Text style={s.title}>Bir hata oluştu</Text>
          <Text style={s.msg}>{this.state.error?.message ?? 'Bilinmeyen hata'}</Text>
          <Pressable style={s.btn} onPress={() => this.setState({ hasError: false })}>
            <Text style={s.btnText}>Tekrar Dene</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
  title: { color: COLORS.error, fontSize: 20, fontWeight: '700', marginBottom: SPACING.md },
  msg: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'center', marginBottom: SPACING.lg },
  btn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderRadius: 12 },
  btnText: { color: COLORS.white, fontWeight: '600' },
});
