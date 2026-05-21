import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme';
import { getShowImage } from '../utils/imageMap';

interface Props {
  title: string;
  category: string;
  theatreName: string;
  location: string;
  duration: number;
  price: number;
  onPress: () => void;
  style?: ViewStyle;
}

export const ShowCard = ({ title, category, theatreName, location, onPress, style }: Props) => {
  const localImg = getShowImage(title);

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
      {localImg ? (
        <Image source={localImg} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imageFallback}>
          <Text style={styles.fallbackText}>{title}</Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>{category}</Text></View>
        </View>
        <Text style={styles.info}>{theatreName} | {location}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: theme.colors.surfaceVariant, borderRadius: theme.borderRadius.m, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border },
  image: { width: '100%', height: 160 },
  imageFallback: { width: '100%', height: 160, backgroundColor: theme.colors.surfaceVariant, alignItems: 'center', justifyContent: 'center' },
  fallbackText: { color: theme.colors.textSecondary, textAlign: 'center', padding: theme.spacing.s },
  content: { padding: theme.spacing.s },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...theme.typography.h3, color: theme.colors.text, flex: 1 },
  badge: { backgroundColor: theme.colors.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: theme.borderRadius.s, marginLeft: 4 },
  badgeText: { color: theme.colors.background, fontSize: 9, fontWeight: '700' },
  info: { color: theme.colors.textSecondary, fontSize: 12, marginTop: 4 },
});
