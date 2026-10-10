import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { GradientButton } from '@/src/components/GradientButton';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) { setError('Tüm alanları doldurun'); return; }
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      setError(e?.message ?? 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.header}>
          <Ionicons name="cafe" size={48} color={COLORS.accent} />
          <Text style={s.title}>Drinks Yönetim</Text>
          <Text style={s.subtitle}>Giriş Yap</Text>
        </View>

        {!!error && <Text style={s.error}>{error}</Text>}

        <View style={s.inputWrap}>
          <TextInput
            style={s.input}
            placeholder="E-posta"
            placeholderTextColor={COLORS.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <View style={s.inputWrap}>
          <TextInput
            style={[s.input, { paddingRight: 48 }]}
            placeholder="Şifre"
            placeholderTextColor={COLORS.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPw}
          />
          <Pressable style={s.eye} onPress={() => setShowPw(!showPw)}>
            <Ionicons name={showPw ? 'eye-off' : 'eye'} size={22} color={COLORS.textMuted} />
          </Pressable>
        </View>

        <GradientButton title="Giriş Yap" onPress={handleLogin} loading={loading} style={{ marginTop: SPACING.md }} />

        <Link href="/auth/signup" asChild>
          <Pressable style={s.link}>
            <Text style={s.linkText}>Hesabınız yok mu? <Text style={s.linkBold}>Kayıt Ol</Text></Text>
          </Pressable>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: SPACING.lg },
  header: { alignItems: 'center', marginBottom: SPACING.xl },
  title: { color: COLORS.accent, fontSize: 28, fontWeight: '800', marginTop: SPACING.sm },
  subtitle: { color: COLORS.textSecondary, fontSize: 16, marginTop: SPACING.xs },
  error: { color: COLORS.error, fontSize: 14, textAlign: 'center', marginBottom: SPACING.md },
  inputWrap: { marginBottom: SPACING.md, position: 'relative' },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: RADIUS.md,
    color: COLORS.text,
    fontSize: 16,
    padding: SPACING.md,
    height: 52,
  },
  eye: { position: 'absolute', right: 14, top: 14 },
  link: { marginTop: SPACING.lg, alignItems: 'center' },
  linkText: { color: COLORS.textSecondary, fontSize: 14 },
  linkBold: { color: COLORS.accent, fontWeight: '700' },
});
