import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface Props {
  seats: any[];
  selectedSeat: any;
  onSelectSeat: (seat: any) => void;
  isSeatReserved: (seat: any) => boolean;
}

type SeatZone = 'premium' | 'standard' | 'balcony';

const getSeatLabel = (seat: any) => `${seat.row}${seat.number}`;

const getSeatZone = (seat: any): SeatZone => {
  if (['A', 'B'].includes(seat.row)) return 'premium';
  if (['C', 'D'].includes(seat.row)) return 'standard';
  return 'balcony';
};

const getZoneStyle = (zone: SeatZone) => {
  switch (zone) {
    case 'premium':
      return styles.seatPremium;
    case 'standard':
      return styles.seatStandard;
    case 'balcony':
      return styles.seatBalcony;
    default:
      return styles.seatStandard;
  }
};

const sections = [
  { title: 'Upper Balcony', rows: ['F', 'E'] },
  { title: 'Main Section', rows: ['D', 'C'] },
  { title: 'Lower Section', rows: ['B', 'A'] },
];

const blocks = [
  [1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10],
];

export const SeatMap = ({ seats, selectedSeat, onSelectSeat, isSeatReserved }: Props) => {
  const seatByLabel = new Map(
    seats.map(seat => [getSeatLabel(seat), seat])
  );

  const renderSeat = (row: string, number: number) => {
    const label = `${row}${number}`;
    const seat = seatByLabel.get(label);

    if (!seat) {
      return <View key={label} style={[styles.seat, styles.seatMissing]} />;
    }

    const reserved = isSeatReserved(seat);
    const selected = selectedSeat?.id === seat.id;
    const zone = getSeatZone(seat);

    return (
      <TouchableOpacity
        key={seat.id}
        disabled={reserved}
        style={[
          styles.seat,
          getZoneStyle(zone),
          reserved && styles.seatReserved,
          selected && styles.seatSelected,
        ]}
        onPress={() => {
          if (!reserved) onSelectSeat(seat);
        }}
      >
        <Text style={[styles.seatText, (reserved || selected) && styles.seatTextActive]}>
          {getSeatLabel(seat)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRow = (row: string) => (
    <View key={row} style={styles.row}>
      <Text style={styles.rowLabel}>{row}</Text>
      <View style={styles.rowBlocks}>
        {blocks.map((block, index) => (
          <View key={`${row}-${index}`} style={[styles.block, index > 0 && styles.aisle]}>
            {block.map(number => renderSeat(row, number))}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.outer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.map}>
          {sections.map(section => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionLabel}>{section.title}</Text>
              {section.rows.map(renderRow)}
            </View>
          ))}
          <View style={styles.stageWrap}>
            <View style={styles.stage}>
              <Text style={styles.stageText}>Stage</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.legend}>
        <View style={styles.legendItem}><View style={[styles.legendDot, styles.seatPremium]} /><Text style={styles.legendText}>Premium</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, styles.seatStandard]} /><Text style={styles.legendText}>Standard</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, styles.seatBalcony]} /><Text style={styles.legendText}>Balcony</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, styles.legendAvailable]} /><Text style={styles.legendText}>Available</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, styles.seatSelected]} /><Text style={styles.legendText}>Selected</Text></View>
        <View style={styles.legendItem}><View style={[styles.legendDot, styles.seatReserved]} /><Text style={styles.legendText}>Reserved</Text></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: { width: '100%', alignItems: 'center', marginBottom: theme.spacing.l },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: theme.spacing.s },
  map: { width: '100%', minWidth: 350, maxWidth: 880, alignItems: 'center', paddingVertical: theme.spacing.m },
  section: { width: '100%', alignItems: 'center', marginBottom: theme.spacing.l },
  sectionLabel: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: theme.spacing.s, textTransform: 'uppercase' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: theme.spacing.xs },
  rowLabel: { color: theme.colors.textSecondary, width: 18, fontWeight: '700', fontSize: 12 },
  rowBlocks: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  block: { flexDirection: 'row', alignItems: 'center' },
  aisle: { marginLeft: theme.spacing.m },
  seat: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  seatPremium: { backgroundColor: '#B8860B' },
  seatStandard: { backgroundColor: '#8A4B20' },
  seatBalcony: { backgroundColor: '#A33A2B' },
  seatReserved: { backgroundColor: theme.colors.textSecondary, opacity: 0.45 },
  seatSelected: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primaryLight, borderWidth: 2 },
  seatMissing: { opacity: 0, backgroundColor: 'transparent' },
  seatText: { color: theme.colors.text, fontSize: 9, fontWeight: '700' },
  seatTextActive: { color: theme.colors.background },
  stageWrap: { width: '86%', alignItems: 'center', marginTop: theme.spacing.s },
  stage: {
    width: '100%',
    height: 38,
    borderRadius: theme.borderRadius.s,
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageText: { color: theme.colors.primary, fontWeight: '800', letterSpacing: 0, textTransform: 'uppercase' },
  legend: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: theme.spacing.s },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: theme.spacing.s, marginBottom: theme.spacing.s },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  legendAvailable: { backgroundColor: theme.colors.surfaceVariant, borderWidth: 1, borderColor: theme.colors.border },
  legendText: { color: theme.colors.textSecondary, fontSize: 12 },
});
