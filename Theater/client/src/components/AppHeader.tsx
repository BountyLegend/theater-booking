import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigation } from '@react-navigation/native';

interface Props {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showReservations?: boolean;
  showShows?: boolean;
}

export const AppHeader = ({ title, subtitle, showBack, onBack, showReservations, showShows }: Props) => {
  const logout = useAuthStore((state) => state.logout);
  const navigation = useNavigation<any>();

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity onPress={onBack} style={styles.button}>
            <Text style={styles.text}>Back</Text>
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.actions}>
        {showReservations && (
          <TouchableOpacity onPress={() => navigation.navigate('Reservations')} style={styles.button}>
            <Text style={styles.text}>Bookings</Text>
          </TouchableOpacity>
        )}
        {showShows && (
          <TouchableOpacity onPress={() => navigation.navigate('Shows')} style={styles.button}>
            <Text style={styles.text}>Shows</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={logout} style={styles.button}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: theme.spacing.m,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  titleContainer: { marginLeft: theme.spacing.s },
  actions: { flexDirection: 'row', alignItems: 'center' },
  button: { padding: theme.spacing.s },
  text: { color: theme.colors.text, fontSize: 14, fontWeight: '600' },
  title: { ...theme.typography.h3, color: theme.colors.text },
  subtitle: { ...theme.typography.caption },
  logout: { color: theme.colors.error, fontWeight: '700', fontSize: 14 },
});
