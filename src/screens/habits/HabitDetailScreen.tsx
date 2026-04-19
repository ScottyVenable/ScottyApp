import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {ArrowLeft, Trash, Flame, CheckCircle} from 'phosphor-react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks/useTheme';
import {useHabitStore} from '../../store/habitStore';
import {ToolsStackParamList} from '../../navigation/types';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import {format, subDays, isSameDay} from 'date-fns';

export default function HabitDetailScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ToolsStackParamList, 'HabitDetail'>>();
  const {habits, toggleCompletion, deleteHabit, isCompletedToday, getWeekData} = useHabitStore();
  const habit = habits.find(h => h.id === route.params.id);

  if (!habit) return null;

  const done = isCompletedToday(habit);
  const weekData = getWeekData(habit);
  const totalDone = habit.completedDates.length;
  const rate = weekData.filter(d => d.completed).length / 7;

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {borderBottomColor: theme.colors.border}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={22} color={theme.colors.text} weight="bold" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { deleteHabit(habit.id); navigation.goBack(); }} hitSlop={8}>
          <Trash size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <View style={[styles.iconWrapper, {backgroundColor: `${habit.color}20`}]}>
            <Flame size={28} color={habit.color} weight="fill" />
          </View>
          <Text style={[styles.title, {color: theme.colors.text}]}>{habit.title}</Text>
        </View>

        {habit.description && (
          <Text style={[styles.description, {color: theme.colors.textSecondary}]}>{habit.description}</Text>
        )}

        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statVal, {color: theme.colors.text}]}>{habit.currentStreak}</Text>
              <Text style={[styles.statLbl, {color: theme.colors.textTertiary}]}>Current Streak</Text>
            </View>
            <View style={[styles.divider, {backgroundColor: theme.colors.border}]} />
            <View style={styles.stat}>
              <Text style={[styles.statVal, {color: theme.colors.text}]}>{habit.longestStreak}</Text>
              <Text style={[styles.statLbl, {color: theme.colors.textTertiary}]}>Best Streak</Text>
            </View>
            <View style={[styles.divider, {backgroundColor: theme.colors.border}]} />
            <View style={styles.stat}>
              <Text style={[styles.statVal, {color: theme.colors.text}]}>{totalDone}</Text>
              <Text style={[styles.statLbl, {color: theme.colors.textTertiary}]}>Total Done</Text>
            </View>
          </View>
        </Card>

        <Text style={[styles.sectionLabel, {color: theme.colors.textSecondary}]}>This Week</Text>
        <View style={styles.weekRow}>
          {weekData.map((d, i) => (
            <View key={i} style={styles.weekDay}>
              <Text style={[styles.weekDayLabel, {color: theme.colors.textTertiary}]}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][new Date(d.date).getDay()]}
              </Text>
              <View style={[styles.weekDot, {backgroundColor: d.completed ? habit.color : theme.colors.backgroundTertiary}]}>
                {d.completed && <CheckCircle size={12} color="#fff" weight="fill" />}
              </View>
            </View>
          ))}
        </View>

        <ProgressBar progress={rate} height={6} color={habit.color} />
        <Text style={[styles.rateHint, {color: theme.colors.textTertiary}]}>
          {Math.round(rate * 100)}% completion this week
        </Text>

        <TouchableOpacity
          onPress={() => toggleCompletion(habit.id)}
          style={[styles.toggleBtn, {backgroundColor: done ? `${habit.color}20` : habit.color, borderColor: habit.color}]}>
          {done ? (
            <CheckCircle size={20} color={habit.color} weight="fill" />
          ) : null}
          <Text style={[styles.toggleBtnLabel, {color: done ? habit.color : '#fff'}]}>
            {done ? 'Completed today' : 'Mark today complete'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth},
  content: {padding: 20, gap: 16},
  titleRow: {flexDirection: 'row', alignItems: 'center', gap: 14},
  iconWrapper: {width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center'},
  title: {fontSize: 24, fontWeight: '700', flex: 1},
  description: {fontSize: 15, lineHeight: 22},
  statsCard: {padding: 16},
  statsRow: {flexDirection: 'row', alignItems: 'center'},
  stat: {flex: 1, alignItems: 'center', gap: 4},
  statVal: {fontSize: 26, fontWeight: '700'},
  statLbl: {fontSize: 12, textAlign: 'center'},
  divider: {width: 1, height: 40},
  sectionLabel: {fontSize: 13, fontWeight: '600'},
  weekRow: {flexDirection: 'row', justifyContent: 'space-between'},
  weekDay: {alignItems: 'center', gap: 6},
  weekDayLabel: {fontSize: 11, fontWeight: '500'},
  weekDot: {width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center'},
  rateHint: {fontSize: 12, textAlign: 'center'},
  toggleBtn: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, marginTop: 8},
  toggleBtnLabel: {fontSize: 15, fontWeight: '600'},
});
