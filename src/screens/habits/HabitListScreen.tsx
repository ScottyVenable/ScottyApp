import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {Plus, Heartbeat, Flame, CheckCircle} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../hooks/useTheme';
import {useHabitStore, Habit} from '../../store/habitStore';
import {useHaptic} from '../../hooks/useHaptic';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import ProgressBar from '../../components/ui/ProgressBar';
import {format, subDays, isSameDay, startOfDay} from 'date-fns';

export default function HabitListScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const haptic = useHaptic();
  const {habits, loadHabits, toggleCompletion, isCompletedToday, getWeekData} = useHabitStore();

  useEffect(() => {
    loadHabits();
  }, []);

  const activeHabits = habits.filter(h => !h.isArchived);
  const completedToday = activeHabits.filter(h => isCompletedToday(h)).length;

  const renderHabit = ({item}: {item: Habit}) => {
    const done = isCompletedToday(item);
    const weekData = getWeekData(item);
    const completionRate = weekData.filter(d => d.completed).length / 7;

    return (
      <Card onPress={() => navigation.navigate('HabitDetail', {id: item.id})} style={styles.habitCard}>
        <View style={styles.habitRow}>
          <View style={[styles.habitIconWrapper, {backgroundColor: `${item.color}20`}]}>
            <Heartbeat size={20} color={item.color} weight="fill" />
          </View>

          <View style={styles.habitInfo}>
            <Text style={[styles.habitTitle, {color: theme.colors.text}]}>{item.title}</Text>
            <View style={styles.habitMeta}>
              <Flame size={12} color="#FF6B35" weight="fill" />
              <Text style={[styles.habitMetaText, {color: theme.colors.textTertiary}]}>
                {item.currentStreak} day streak
              </Text>
            </View>
            <View style={styles.weekDots}>
              {weekData.map((d, i) => (
                <View
                  key={i}
                  style={[
                    styles.weekDot,
                    {backgroundColor: d.completed ? item.color : theme.colors.backgroundTertiary},
                  ]}
                />
              ))}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              haptic(done ? 'light' : 'success');
              toggleCompletion(item.id);
            }}
            style={[
              styles.checkBtn,
              {
                backgroundColor: done ? item.color : 'transparent',
                borderColor: done ? item.color : theme.colors.border,
              },
            ]}>
            {done && <CheckCircle size={18} color="#fff" weight="fill" />}
          </TouchableOpacity>
        </View>
        <ProgressBar progress={completionRate} height={3} color={item.color} style={styles.weekBar} />
      </Card>
    );
  };

  return (
    <ScreenWrapper>
      <View style={[styles.header, {borderBottomColor: theme.colors.borderSubtle}]}>
        <View>
          <Text style={[styles.title, {color: theme.colors.text}]}>Habits</Text>
          <Text style={[styles.subtitle, {color: theme.colors.textTertiary}]}>
            {completedToday}/{activeHabits.length} done today
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('HabitCreate')}
          style={[styles.addBtn, {backgroundColor: theme.colors.accent}]}>
          <Plus size={20} color={theme.colors.textInverse} weight="bold" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeHabits}
        renderItem={renderHabit}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={<Heartbeat size={28} color={theme.colors.textTertiary} />}
            title="No habits tracked"
            description="Build consistency with daily habit tracking."
            actionLabel="Add Habit"
            onAction={() => navigation.navigate('HabitCreate')}
          />
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth},
  title: {fontSize: 24, fontWeight: '700'},
  subtitle: {fontSize: 13, marginTop: 2},
  addBtn: {width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center'},
  list: {paddingHorizontal: 16, paddingTop: 10, paddingBottom: 32, gap: 10},
  habitCard: {gap: 10, padding: 14},
  habitRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  habitIconWrapper: {width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center'},
  habitInfo: {flex: 1, gap: 4},
  habitTitle: {fontSize: 15, fontWeight: '600'},
  habitMeta: {flexDirection: 'row', alignItems: 'center', gap: 4},
  habitMetaText: {fontSize: 12},
  weekDots: {flexDirection: 'row', gap: 4, marginTop: 2},
  weekDot: {width: 8, height: 8, borderRadius: 4},
  checkBtn: {width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center'},
  weekBar: {marginTop: 4},
});
