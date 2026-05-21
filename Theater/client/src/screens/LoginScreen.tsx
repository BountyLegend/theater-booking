import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { theme } from '../theme';
import { PremiumButton } from '../components/PremiumButton';
import { PremiumTextInput } from '../components/PremiumTextInput';
import { AppHeader } from '../components/AppHeader';

import { API_URL } from '../config/api';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async () => {
    if (!email || !password) return setError('Please fill in all fields');
    setError('');
    setLoading(true);
    const url = `${API_URL}/auth/login`;
    try {
      const response = await axios.post(url, { email, password });
      if (response.data.requiresVerification) {
        navigation.navigate('VerifyLoginCode', {
          email: response.data.email || email,
          message: response.data.message || 'Verification code sent.'
        });
        return;
      }
      if (response.data.accessToken || response.data.token) {
        await setAuth(response.data.accessToken || response.data.token, response.data.refreshToken || null, response.data.user);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Login" />
      <View style={styles.webWrapper}>
        <Text style={styles.title}>Welcome Back</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PremiumTextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <PremiumTextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true} />
        
        <PremiumButton title="Login" onPress={handleLogin} loading={loading} />
        
        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>Don't have an account? Register</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  webWrapper: { width: '100%', maxWidth: 400, padding: theme.spacing.l, alignSelf: 'center' },
  title: { ...theme.typography.h1, color: theme.colors.text, marginBottom: theme.spacing.xl, textAlign: 'center' },
  error: { color: theme.colors.error, textAlign: 'center', marginBottom: theme.spacing.m },
  link: { color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.l },
});
