import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { theme } from '../theme';

export const PremiumTextInput = (props: TextInputProps) => (
  <TextInput 
    {...props} 
    placeholderTextColor={theme.colors.textSecondary}
    style={[styles.input, props.style]}
  />
);

const styles = StyleSheet.create({
  input: { backgroundColor: theme.colors.surfaceVariant, color: theme.colors.text, padding: 16, borderRadius: theme.borderRadius.m, marginBottom: theme.spacing.m, fontSize: 16 },
});
