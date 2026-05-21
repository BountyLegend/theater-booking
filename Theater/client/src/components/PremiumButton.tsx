import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../theme';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const PremiumButton = ({ title, onPress, loading, disabled, style, textStyle, variant = 'primary' }: Props) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary': return styles.secondary;
      case 'outline': return styles.outline;
      default: return styles.primary;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, getVariantStyle(), disabled && styles.disabled, style]} 
      onPress={onPress} 
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.colors.primary : theme.colors.background} />
      ) : (
        <Text style={[styles.text, variant === 'outline' && styles.outlineText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { padding: 16, borderRadius: theme.borderRadius.m, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: theme.colors.primary },
  secondary: { backgroundColor: theme.colors.secondary },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.primary },
  disabled: { opacity: 0.5 },
  text: { color: theme.colors.background, fontWeight: '700', fontSize: 16 },
  outlineText: { color: theme.colors.primary },
});
