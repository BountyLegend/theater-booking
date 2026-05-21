import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { PremiumButton } from './PremiumButton';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmTitle?: string;
}

export const PremiumModal = ({ visible, title, message, onCancel, onConfirm, confirmTitle = "Cancel" }: Props) => (
  <Modal visible={!!visible} transparent={true} animationType="fade">
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.actions}>
          <PremiumButton title="Keep" onPress={onCancel} variant="outline" style={styles.button} />
          <PremiumButton title={confirmTitle} onPress={onConfirm} variant="secondary" style={styles.button} />
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  card: { width: '80%', maxWidth: 400, backgroundColor: theme.colors.surface, padding: theme.spacing.l, borderRadius: theme.borderRadius.m },
  title: { ...theme.typography.h3, color: theme.colors.text, marginBottom: theme.spacing.m },
  message: { color: theme.colors.textSecondary, marginBottom: theme.spacing.l },
  actions: { flexDirection: 'row', gap: 10 },
  button: { flex: 1 },
});
