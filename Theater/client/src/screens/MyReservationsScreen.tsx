import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, SafeAreaView, Text, Platform, ScrollView } from 'react-native';
import { theme } from '../theme';
import { ReservationCard } from '../components/ReservationCard';
import { LoadingState, ErrorState, EmptyState } from '../components/States';
import { AppHeader } from '../components/AppHeader';
import { PremiumModal } from '../components/PremiumModal';
import { apiClient } from '../config/apiClient';

export default function MyReservationsScreen({ navigation }: any) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [targetReservation, setTargetReservation] = useState<any>(null);
  const [modalAction, setModalAction] = useState<'cancel' | 'change'>('cancel');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchReservations);
    return unsubscribe;
  }, [navigation]);

  const fetchReservations = () => {
    setLoading(true);
    setError(null);
    apiClient.get('/user/reservations')
      .then(res => { setReservations(res.data); setLoading(false); })
      .catch(() => { setError("Could not load reservations"); setLoading(false); });
  };

  const confirmCancel = (reservation: any) => {
    setTargetReservation(reservation);
    setModalAction('cancel');
    setModalVisible(true);
  };

  const confirmChangeSeat = (reservation: any) => {
    setTargetReservation(reservation);
    setModalAction('change');
    setModalVisible(true);
  };

  const isFutureReservation = (reservation: any) => {
    const startTime = reservation.showtime?.start_time;
    return startTime ? new Date(startTime).getTime() > Date.now() : false;
  };

  const handleCancel = async () => {
    if (!targetReservation) return;
    setModalVisible(false);
    const id = targetReservation.id;
    
    try {
      await apiClient.delete(`/reservations/${id}`);
      setReservations(prev => prev.filter(r => r.id !== id));
      setSuccess("Reservation cancelled successfully.");
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Cancel failed");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleChangeSeat = async () => {
    if (!targetReservation) return;
    setModalVisible(false);

    const id = targetReservation.id;
    const showId = targetReservation.showtime?.show?.id;

    if (!showId) {
      setError("Could not open performance details");
      setTimeout(() => setError(null), 5000);
      return;
    }

    try {
      await apiClient.delete(`/reservations/${id}`);
      setReservations(prev => prev.filter(r => r.id !== id));
      setTargetReservation(null);
      navigation.navigate('ShowDetails', { showId });
    } catch (err: any) {
      setError(err.response?.data?.error || "Change seat failed");
      setTimeout(() => setError(null), 5000);
    }
  };

  if (loading) return <LoadingState />;
  if (error && reservations.length === 0) return <ErrorState message={error} />;

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="My Reservations" subtitle="Manage your upcoming theatre nights" showShows />
      {Platform.OS === 'web' ? (
        <ScrollView
          style={styles.webScrollContainer}
          contentContainerStyle={styles.webInnerContent}
          showsVerticalScrollIndicator={true}
        >
          {success && <Text style={styles.success}>{success}</Text>}
          {error && <Text style={styles.error}>{error}</Text>}
          {reservations.length === 0 ? (
            <EmptyState message="No reservations found" />
          ) : (
            reservations.map(item => (
              <ReservationCard
                key={item.id.toString()}
                showTitle={item.showtime?.show?.title || "Unknown Show"}
                theatreName={item.showtime?.show?.theater?.name || "Unknown Theatre"}
                date={item.showtime?.start_time ? new Date(item.showtime.start_time).toLocaleString() : "TBD"}
                seat={item.seat ? `${item.seat.row}${item.seat.number}` : "No seat"}
                onCancel={() => confirmCancel(item)}
                onChangeSeat={isFutureReservation(item) ? () => confirmChangeSeat(item) : undefined}
              />
            ))
          )}
        </ScrollView>
      ) : (
        <>
          {success && <Text style={styles.success}>{success}</Text>}
          {error && <Text style={styles.error}>{error}</Text>}
          <FlatList
            data={reservations}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<EmptyState message="No reservations found" />}
            renderItem={({ item }) => (
              <ReservationCard 
                showTitle={item.showtime?.show?.title || "Unknown Show"}
                theatreName={item.showtime?.show?.theater?.name || "Unknown Theatre"}
                date={item.showtime?.start_time ? new Date(item.showtime.start_time).toLocaleString() : "TBD"}
                seat={item.seat ? `${item.seat.row}${item.seat.number}` : "No seat"}
                onCancel={() => confirmCancel(item)}
                onChangeSeat={isFutureReservation(item) ? () => confirmChangeSeat(item) : undefined}
              />
            )}
          />
        </>
      )}
      <PremiumModal 
        visible={modalVisible}
        title={modalAction === 'change' ? "Change seat?" : "Cancel reservation?"}
        message={modalAction === 'change'
          ? "To change your seat, the current reservation will be cancelled and you can book a new seat."
          : "This will release your selected seat."
        }
        onCancel={() => setModalVisible(false)}
        onConfirm={modalAction === 'change' ? handleChangeSeat : handleCancel}
        confirmTitle={modalAction === 'change' ? "Continue" : "Cancel"}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  list: { padding: theme.spacing.l, paddingBottom: 100, width: '100%', maxWidth: 720, alignSelf: 'center' },
  webScrollContainer: {
    height: "calc(100vh - 96px)" as any,
  } as any,
  webInnerContent: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    padding: theme.spacing.l,
    paddingBottom: 320,
  },
  success: { color: theme.colors.success, textAlign: 'center', padding: theme.spacing.m, fontWeight: '700' },
  error: { color: theme.colors.error, textAlign: 'center', padding: theme.spacing.m, fontWeight: '700' },
});
