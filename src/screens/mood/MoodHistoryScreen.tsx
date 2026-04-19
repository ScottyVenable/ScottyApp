import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks/useTheme';
import {storage} from '../../services/storage';
import {MoodEntry} from './MoodTrackerScreen';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import {format} from 'date-fns';

const MOOD_COLORS: Record<number, string> = {1: '#EF4444', 2: '#F97316', 3: '#EAB308', 4: '#22C55E', 5: '#7C3AED'};
const MOOD_LABELS: Record<number, string> = {1: 'Rough', 2: 'Low', 3: 'Okay', 4: 'Good', 5: 'Great'};

export default function MoodHistoryScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  useEffect(() => {
    const raw = storage.getString('mood_entries');
    if (raw) try { setEntries(JSON.parse(raw)); } catch { /* ignore */ }
  }, []);

  const renderEntry = ({item}: {item: MoodEntry}) => (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.moodBadge, {backgroundColor: `${MOOD_COLORS[item.level]}20`}]}>
          <Text style={[styles.moodLevel, {color: MOOD_COLORS[item.level]}]}>
            {MOOD_LABELS[item.level]}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.date, {color: theme.colors.textSecondary}]}>
            {format(new Date(item.createdAt), 'MMM d, yyyy · h:mm a')}
          </Text>
          {item.note ? (
            <Text style={[styles.note, {color: theme.colors.text}]} numberOfLines={2}>{item.note}</Text>
          ) : null}
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <Header title="Mood History" showBack />
      <FlatList
        data={entries}
        renderItem={renderEntry}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={[styles.empty, {color: theme.colors.textTertiary}]}>No mood entries yet.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  list: {padding: 16, gap: 8},
  card: {padding: 14},
  row: {flexDirection: 'row', alignItems: 'flex-start', gap: 12},
  moodBadge: {paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8},
  moodLevel: {fontSize: 13, fontWeight: '700'},
  info: {flex: 1, gap: 4},
  date: {fontSize: 12},
  note: {fontSize: 14, lineHeight: 20},
  empty: {textAlign: 'center', marginTop: 48, fontSize: 14},
});
