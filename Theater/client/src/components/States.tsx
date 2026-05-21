import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export const LoadingState = () => (
  <View style={styles.center}><Text style={styles.text}>Loading...</Text></View>
);

export const EmptyState = ({ message }: { message: string }) => (
  <View style={styles.center}><Text style={styles.text}>{message}</Text></View>
);

export const ErrorState = ({ message }: { message: string }) => (
  <View style={styles.center}><Text style={styles.error}>{message}</Text></View>
);

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: theme.spacing.xl },
  text: { color: theme.colors.textSecondary },
  error: { color: theme.colors.error },
});
