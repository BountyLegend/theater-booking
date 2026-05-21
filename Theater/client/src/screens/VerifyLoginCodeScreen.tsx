import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { theme } from '../theme';
import { PremiumButton } from '../components/PremiumButton';
import { PremiumTextInput } from '../components/PremiumTextInput';
import { AppHeader } from '../components/AppHeader';
import { API_URL } from '../config/api';

export default function VerifyLoginCodeScreen({ route, navigation }: any) {
  const { email, message } = route.params || {};
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState(message || 'Verification code sent.');
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleVerify = async () => {
    if (!email || !code) return setError('Please enter the verification code');
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/verify-login-code`, { email, code });
      await setAuth(response.data.accessToken || response.data.token, response.data.refreshToken || null, response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setError('');
    setResending(true);

    try {
      const response = await axios.post(`${API_URL}/resend-login-code`, { email });
      setInfo(response.data.message || 'Verification code sent.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Could not resend verification code');
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Verify Login" showBack={true} onBack={() => navigation.navigate('Login')} />
      <View style={styles.webWrapper}>
        <Text style={styles.title}>Enter Code</Text>
        <Text style={styles.email}>{email}</Text>
        {info ? <Text style={styles.info}>{info}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PremiumTextInput
          placeholder="6-digit code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          autoCapitalize="none"
        />

        <PremiumButton title="Verify" onPress={handleVerify} loading={loading} />
        <PremiumButton title="Resend Code" onPress={handleResend} loading={resending} variant="outline" style={styles.secondaryButton} />

        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Back to Login</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  webWrapper: { width: '100%', maxWidth: 400, padding: theme.spacing.l, alignSelf: 'center' },
  title: { ...theme.typography.h1, color: theme.colors.text, marginBottom: theme.spacing.m, textAlign: 'center' },
  email: { color: theme.colors.primary, textAlign: 'center', marginBottom: theme.spacing.m, fontWeight: '700' },
  info: { color: theme.colors.textSecondary, textAlign: 'center', marginBottom: theme.spacing.m },
  error: { color: theme.colors.error, textAlign: 'center', marginBottom: theme.spacing.m },
  secondaryButton: { marginTop: theme.spacing.m },
  link: { color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.l },
});
