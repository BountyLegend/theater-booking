import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { theme } from '../theme';
import { PremiumButton } from '../components/PremiumButton';
import { PremiumTextInput } from '../components/PremiumTextInput';
import { AppHeader } from '../components/AppHeader';

import { API_URL } from '../config/api';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleRegister = async () => {
    if (!name || !email || !password) return setError('Please fill in all fields');
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      await setAuth(response.data.accessToken || response.data.token, response.data.refreshToken || null, response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Register" showBack={true} onBack={() => navigation.goBack()} />
      <View style={styles.webWrapper}>
        <Text style={styles.title}>Join Us</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PremiumTextInput placeholder="Name" value={name} onChangeText={setName} />
        <PremiumTextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <PremiumTextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true} />
        
        <PremiumButton title="Register" onPress={handleRegister} loading={loading} />
        
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Already have an account? Login</Text>
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
