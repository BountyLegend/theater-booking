import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, ScrollView, FlatList, TouchableOpacity, Platform } from 'react-native';
import { theme } from '../theme';
import { ShowCard } from '../components/ShowCard';
import { LoadingState, ErrorState, EmptyState } from '../components/States';
import { AppHeader } from '../components/AppHeader';
import { apiClient } from '../config/apiClient';

const CATEGORIES = ['All', 'Drama', 'Musical', 'Opera', 'Classic', 'Comedy', 'Ballet', 'Thriller', 'Tragedy'];

export default function HomeScreen({ navigation }: any) {
  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = () => {
    setLoading(true);
    apiClient.get('/shows')
      .then(res => { setShows(res.data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  };

  const filteredShows = useMemo(() => {
    const sTerm = search.toLowerCase().trim();
    return shows.filter(s =>
      (selectedCategory === 'All' || s.category.trim() === selectedCategory) &&
      (s.title.toLowerCase().includes(sTerm) ||
       s.category.toLowerCase().includes(sTerm) ||
       s.theater?.name.toLowerCase().includes(sTerm) ||
       s.theater?.location.toLowerCase().includes(sTerm))
    );
  }, [shows, search, selectedCategory]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message="Failed to load shows" />;

  const renderCard = (item: any) => (
    <ShowCard
      key={item.id}
      title={item.title}
      category={item.category}
      theatreName={item.theater?.name || "Unknown Theatre"}
      location={item.theater?.location || "Unknown"}
      duration={item.duration || 0}
      price={item.showtimes?.[0]?.price || 0}
      onPress={() => navigation.navigate('ShowDetails', { showId: item.id })}
      style={Platform.OS === 'web' ? styles.webCard : styles.mobileCard}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Explore Shows" subtitle="Discover premium theatre nights" showReservations />

      {Platform.OS === 'web' ? (
        <ScrollView
          style={styles.webScrollContainer}
          contentContainerStyle={styles.webInnerContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.header}>
            <TextInput
              placeholder="Search shows, theatres, location..."
              placeholderTextColor={theme.colors.textSecondary}
              style={styles.search}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer} contentContainerStyle={styles.chipsContent}>
            {CATEGORIES.map(c => (
              <TouchableOpacity key={c} style={[styles.chip, selectedCategory === c && styles.chipActive]} onPress={() => setSelectedCategory(c)}>
                <Text style={[styles.chipText, selectedCategory === c && styles.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.webGrid}>{filteredShows.map(renderCard)}</View>
          {filteredShows.length === 0 && <EmptyState message="No shows found." />}
        </ScrollView>
      ) : (
        <FlatList
          data={filteredShows}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <TextInput
                  placeholder="Search shows, theatres, location..."
                  placeholderTextColor={theme.colors.textSecondary}
                  style={styles.search}
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer} contentContainerStyle={styles.chipsContent}>
                {CATEGORIES.map(c => (
                  <TouchableOpacity key={c} style={[styles.chip, selectedCategory === c && styles.chipActive]} onPress={() => setSelectedCategory(c)}>
                    <Text style={[styles.chipText, selectedCategory === c && styles.chipTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          }
          ListEmptyComponent={<EmptyState message="No shows found." />}
          renderItem={({ item }) => renderCard(item)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingHorizontal: theme.spacing.l, marginBottom: theme.spacing.m },
  search: { backgroundColor: theme.colors.surfaceVariant, color: theme.colors.text, padding: 16, borderRadius: theme.borderRadius.m, fontSize: 16 },
  chipsContainer: { flexGrow: 0, marginBottom: theme.spacing.l },
  chipsContent: { paddingHorizontal: theme.spacing.l },
  chip: { minHeight: 40, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999, backgroundColor: theme.colors.surfaceVariant, marginRight: 8, alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: theme.colors.primary },
  chipText: { color: theme.colors.text, fontWeight: '600' },
  chipTextActive: { color: theme.colors.background },
  list: { paddingHorizontal: theme.spacing.l, paddingBottom: 100 },
  webScrollContainer: {
    height: "calc(100vh - 96px)" as any,
  } as any,
  webInnerContent: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingBottom: 320,
  },
  webGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  webCard: { width: 300, margin: 10, height: 280 },
  mobileCard: { marginBottom: theme.spacing.m },
});
