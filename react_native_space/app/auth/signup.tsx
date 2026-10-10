import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/src/contexts/AuthContext';
import { GradientButton } from '@/src/components/GradientButton';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password) { setError('Gerekli alanları doldurun'); return; }
    if (password.length < 8) { setError('Şifre en az 8 karakter olmalıdır'); return; }
    if (password !== passwordConfirm) { setError('Şifreler eşleşmiyor'); return; }
    setError('');
    setLoading(true);
    try {
      await signup(name.trim(), email.trim(), password, inviteCode.trim() || undefined);
    } catch (e: any) {
      setError(e?.message ?? 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.header}>
          <Ionicons name="cafe" size={40} color={COLORS.accent} />
          <Text style={s.title}>Drinks Yönetim</Text>
          <Text style={s.subtitle}>Kayıt Ol</Text>
        </View>

        {!!error && <Text style={s.error}>{error}</Text>}

        <TextInput style={s.input} placeholder="Ad Soyad" placeholderTextColor={COLORS.textMuted} value={name} onChangeText={setName} />
        <TextInput style={s.input} placeholder="E-posta" placeholderTextColor={COLORS.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <View style={s.inputWrap}>
          <TextInput style={[s.input, { paddingRight: 48, marginBottom: 0 }]} placeholder="Şifre (en az 8 karakter)" placeholderTextColor={COLORS.textMuted} value={password} onChangeText={setPassword} secureTextEntry={!showPw} />
          <Pressable style={s.eye} onPress={() => setShowPw(!showPw)}>
            <Ionicons name={showPw ? 'eye-off' : 'eye'} size={22} color={COLORS.textMuted} />
          </Pressable>
        </View>

        <TextInput style={s.input} placeholder="Şifre Tekrar" placeholderTextColor={COLORS.textMuted} value={passwordConfirm} onChangeText={setPasswordConfirm} secureTextEntry={!showPw} />

        <TextInput style={s.input} placeholder="Davet Kodu (ilk hesap/sahip için boş bırakın)" placeholderTextColor={COLORS.textMuted} value={inviteCode} onChangeText={setInviteCode} autoCapitalize="characters" />

        <GradientButton title="Kayıt Ol" onPress={handleSignup} loading={loading} style={{ marginTop: SPACING.sm }} />

        <Link href="/auth/login" asChild>
          <Pressable style={s.link}>
            <Text style={s.linkText}>Zaten hesabınız var mı? <Text style={s.linkBold}>Giriş Yap</Text></Text>
          </Pressable>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: SPACING.lg },
  header: { alignItems: 'center', marginBottom: SPACING.lg },
  title: { color: COLORS.accent, fontSize: 26, fontWeight: '800', marginTop: SPACING.xs },
  subtitle: { color: COLORS.textSecondary, fontSize: 16, marginTop: SPACING.xs },
  error: { color: COLORS.error, fontSize: 14, textAlign: 'center', marginBottom: SPACING.md },
  input: {
    backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.surfaceBorder,
    borderRadius: RADIUS.md, color: COLORS.text, fontSize: 16, padding: SPACING.md,
    height: 52, marginBottom: SPACING.md,
  },
  inputWrap: { marginBottom: SPACING.md, position: 'relative' },
  eye: { position: 'absolute', right: 14, top: 14 },
  link: { marginTop: SPACING.lg, alignItems: 'center' },
  linkText: { color: COLORS.textSecondary, fontSize: 14 },
  linkBold: { color: COLORS.accent, fontWeight: '700' },
});
