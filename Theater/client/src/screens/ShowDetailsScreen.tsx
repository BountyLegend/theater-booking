import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Image, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { theme } from '../theme';
import { LoadingState, ErrorState } from '../components/States';
import { AppHeader } from '../components/AppHeader';
import { getShowImage } from '../utils/imageMap';
import { PremiumButton } from '../components/PremiumButton';
import { SeatMap } from '../components/SeatMap';
import { apiClient } from '../config/apiClient';

const isSeatReserved = (seat: any) =>
  seat.is_reserved === true ||
  seat.reserved === true ||
  seat.status === "reserved";

export default function ShowDetailsScreen({ route, navigation }: any) {
  const { showId } = route.params;
  const [show, setShow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);
  const [seats, setSeats] = useState<any[]>([]);
  const [seatsLoading, setSeatsLoading] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<any>(null);
  const [reserving, setReserving] = useState(false);
  const [success, setSuccess] = useState("");
  const [reserveError, setReserveError] = useState("");

  useEffect(() => {
    apiClient.get(`/shows/${showId}`)
      .then(res => {
        setShow(res.data);
        setShowtimes(res.data.showtimes || []);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const refetchSeats = async (showtimeId: number) => {
    const res = await apiClient.get(`/seats?showtimeId=${showtimeId}`);
    setSeats(res.data);
  };

  const selectShowtime = (st: any) => {
    setSelectedShowtime(st);
    setSelectedSeat(null);
    setSuccess("");
    setReserveError("");
    setSeatsLoading(true);
    apiClient.get(`/seats?showtimeId=${st.id}`)
      .then(res => { setSeats(res.data); setSeatsLoading(false); })
      .catch(() => { setSeatsLoading(false); });
  };

  const handleReserve = async () => {
    if (!selectedShowtime || !selectedSeat || reserving || isSeatReserved(selectedSeat)) return;

    console.log("Reserve seat", {
      showtimeId: selectedShowtime.id,
      selectedSeat,
      seatId: selectedSeat.id,
      row: selectedSeat.row,
      number: selectedSeat.number,
    });

    setReserving(true);
    setSuccess("");
    setReserveError("");

    try {
      await apiClient.post(
        '/reservations',
        {
          showtimeId: selectedShowtime.id,
          seatId: selectedSeat.id
        }
      );

      setSuccess("Reservation confirmed.");
      setSeats(prev => prev.map(seat =>
        seat.id === selectedSeat.id
          ? { ...seat, is_reserved: true, reserved: true, status: "reserved" }
          : seat
      ));
      setSelectedSeat(null);
      await refetchSeats(selectedShowtime.id);
    } catch (err: any) {
      console.log("Reservation failed", err.response?.status, err.response?.data);
      setReserveError(err.response?.data?.error || err.response?.data?.message || "Failed to create reservation");
    } finally {
      setReserving(false);
    }
  };

  if (loading) return <LoadingState />;
  if (error || !show) return <ErrorState message="Could not load show details" />;

  const localImg = getShowImage(show.title);

  const DetailsContent = (
    <View style={styles.webWrapper}>
      {localImg ? (
        <Image source={localImg} style={styles.poster} resizeMode="cover" />
      ) : (
        <View style={styles.imageFallback}><Text style={styles.fallbackText}>{show.title}</Text></View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{show.title}</Text>
        <Text style={styles.meta}>{show.category} | {show.duration} mins | {show.age_rating}</Text>
        <Text style={styles.desc}>{show.description}</Text>
        <Text style={styles.location}>{show.theater?.name} | {show.theater?.location}</Text>

        <Text style={styles.sectionTitle}>Select Showtime</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeList}>
          {showtimes.map(st => (
            <TouchableOpacity
              key={st.id}
              style={[styles.timeCard, selectedShowtime?.id === st.id && styles.timeCardActive]}
              onPress={() => selectShowtime(st)}
            >
              <Text style={[styles.timeText, selectedShowtime?.id === st.id && styles.activeText]}>
                {new Date(st.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text style={[styles.timeMeta, selectedShowtime?.id === st.id && styles.activeText]}>{st.hall_name} | ${st.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {seatsLoading && <ActivityIndicator style={{ margin: 20 }} color={theme.colors.primary} />}

        {!seatsLoading && seats.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Select Seats</Text>
            <SeatMap
              seats={seats}
              selectedSeat={selectedSeat}
              onSelectSeat={setSelectedSeat}
              isSeatReserved={isSeatReserved}
            />
            {success ? <Text style={styles.success}>{success}</Text> : null}
            {reserveError ? <Text style={styles.reserveError}>{reserveError}</Text> : null}
            <PremiumButton
              title={selectedSeat ? `Reserve ${selectedSeat.row}${selectedSeat.number}` : "Select a seat to continue"}
              onPress={handleReserve}
              loading={reserving}
              disabled={!selectedSeat || reserving}
              style={styles.reserveButton}
            />
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title={show.title} subtitle={show.category} showBack onBack={() => navigation.goBack()} showReservations />
      {Platform.OS === 'web' ? (
        <ScrollView
          style={styles.webScrollContainer}
          contentContainerStyle={styles.webInnerContent}
          showsVerticalScrollIndicator={true}
        >
          {DetailsContent}
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {DetailsContent}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 180 },
  webScrollContainer: {
    height: "calc(100vh - 96px)" as any,
  } as any,
  webInnerContent: { paddingBottom: 320 },
  webWrapper: { width: '100%', maxWidth: 720, alignSelf: 'center' },
  poster: { width: '100%', height: 220 },
  imageFallback: { width: '100%', height: 220, backgroundColor: theme.colors.surfaceVariant, alignItems: 'center', justifyContent: 'center' },
  fallbackText: { color: theme.colors.textSecondary, padding: 20, textAlign: 'center' },
  content: { padding: theme.spacing.l },
  title: { ...theme.typography.h1, color: theme.colors.text },
  meta: { color: theme.colors.primary, fontSize: 16, marginVertical: theme.spacing.s },
  desc: { color: theme.colors.textSecondary, marginBottom: theme.spacing.xl },
  location: { color: theme.colors.text, marginBottom: theme.spacing.xl, fontWeight: '700' },
  sectionTitle: { ...theme.typography.h3, color: theme.colors.text, marginBottom: theme.spacing.m },
  timeList: { paddingBottom: theme.spacing.m },
  timeCard: { padding: theme.spacing.m, backgroundColor: theme.colors.surfaceVariant, borderRadius: theme.borderRadius.m, marginRight: theme.spacing.s, borderWidth: 1, borderColor: 'transparent' },
  timeCardActive: { borderColor: theme.colors.primary },
  timeText: { color: theme.colors.text, fontWeight: '700' },
  activeText: { color: theme.colors.background },
  timeMeta: { color: theme.colors.textSecondary, fontSize: 12, marginTop: 4 },
  seatGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  seat: { width: 40, height: 40, borderRadius: 8, backgroundColor: theme.colors.surfaceVariant, alignItems: 'center', justifyContent: 'center', margin: 4 },
  seatReserved: { backgroundColor: theme.colors.textSecondary, opacity: 0.5 },
  seatSelected: { backgroundColor: theme.colors.primary },
  seatText: { color: theme.colors.text, fontSize: 10 },
  seatTextActive: { color: theme.colors.background, fontWeight: '700' },
  legend: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: theme.spacing.m, marginBottom: theme.spacing.l },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: theme.spacing.s, marginBottom: theme.spacing.s },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  legendAvailable: { backgroundColor: theme.colors.surfaceVariant },
  legendSelected: { backgroundColor: theme.colors.primary },
  legendReserved: { backgroundColor: theme.colors.textSecondary, opacity: 0.5 },
  legendText: { color: theme.colors.textSecondary, fontSize: 12 },
  reserveButton: { marginTop: theme.spacing.s, marginBottom: theme.spacing.xl },
  success: { color: theme.colors.success, textAlign: 'center', marginTop: theme.spacing.s, marginBottom: theme.spacing.s, fontWeight: '700' },
  reserveError: { color: theme.colors.error, textAlign: 'center', marginTop: theme.spacing.s, marginBottom: theme.spacing.s, fontWeight: '700' },
});
