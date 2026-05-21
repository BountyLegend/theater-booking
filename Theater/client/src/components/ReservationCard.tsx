import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { PremiumButton } from './PremiumButton';

interface Props {
  showTitle: string;
  theatreName: string;
  date: string;
  seat: string;
  onCancel: () => void;
  onChangeSeat?: () => void;
}

export const ReservationCard = ({ showTitle, theatreName, date, seat, onCancel, onChangeSeat }: Props) => (
  <View style={styles.card}>
    <View style={styles.content}>
      <Text style={styles.title}>{showTitle}</Text>
      <Text style={styles.subtitle}>{theatreName}</Text>
      <Text style={styles.info}>{date}</Text>
    </View>
    <View style={styles.seatBox}>
      <Text style={styles.seatLabel}>Seat</Text>
      <Text style={styles.seatText}>{seat}</Text>
    </View>
    <View style={styles.actions}>
      {onChangeSeat && (
        <PremiumButton title="Change Seat" onPress={onChangeSeat} variant="secondary" style={styles.changeButton} textStyle={{ fontSize: 12 }} />
      )}
      <PremiumButton title="Cancel" onPress={onCancel} variant="outline" style={styles.button} textStyle={{ fontSize: 12 }} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: theme.colors.surfaceVariant, padding: theme.spacing.m, borderRadius: theme.borderRadius.m, flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.m },
  content: { flex: 1 },
  title: { color: theme.colors.text, fontSize: 16, fontWeight: '700' },
  subtitle: { color: theme.colors.primary, marginVertical: theme.spacing.xs },
  info: { color: theme.colors.textSecondary, fontSize: 12 },
  seatBox: { minWidth: 74, marginLeft: theme.spacing.m, marginRight: theme.spacing.l, alignItems: 'flex-start' },
  seatLabel: { color: theme.colors.textSecondary, fontSize: 11 },
  seatText: { color: theme.colors.text, fontSize: 14, fontWeight: '700', marginTop: 2 },
  actions: { alignItems: 'stretch', gap: theme.spacing.s },
  button: { padding: theme.spacing.s, width: 80 },
  changeButton: { padding: theme.spacing.s, width: 110 },
});
