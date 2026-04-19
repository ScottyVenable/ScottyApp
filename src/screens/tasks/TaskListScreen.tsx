import React, {useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Alert} from 'react-native';
import {Plus, CheckSquare, Lightning, Flame, Trophy} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import Animated, {FadeInDown, FadeOutUp} from 'react-native-reanimated';
import {useTheme} from '../../hooks/useTheme';
import {useTaskStore} from '../../store/taskStore';
import {useHaptic} from '../../hooks/useHaptic';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import ProgressBar from '../../components/ui/ProgressBar';
import EmptyState from '../../components/ui/EmptyState';
import {Task, TaskPriority, getXPForNextLevel} from '../../types/tasks';

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  urgent: '#EF4444',
  high: '#F97316',
  medium: '#EAB308',
  low: '#6B7280',
};

export default function TaskListScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const haptic = useHaptic();
  const {stats, loadData, getFilteredTasks, completeTask, deleteTask, newlyUnlockedAchievement, clearNewAchievement} = useTaskStore();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (newlyUnlockedAchievement) {
      Alert.alert(
        'Achievement Unlocked!',
        `${newlyUnlockedAchievement.title}\n${newlyUnlockedAchievement.description}`,
        [{text: 'Nice!', onPress: clearNewAchievement}],
      );
    }
  }, [newlyUnlockedAchievement]);

  const tasks = getFilteredTasks();
  const xp = getXPForNextLevel(stats.totalXP);
  const activeTasks = tasks.filter(t => t.status !== 'done');
  const completedTasks = tasks.filter(t => t.status === 'done');

  const handleComplete = useCallback((id: string) => {
    haptic('success');
    completeTask(id);
  }, [haptic, completeTask]);

  const handleDelete = useCallback((id: string) => {
    Alert.alert('Delete Task', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', style: 'destructive', onPress: () => deleteTask(id)},
    ]);
  }, [deleteTask]);

  const renderTask = useCallback(({item, index}: {item: Task; index: number}) => (
    <Animated.View entering={FadeInDown.delay(index * 30).springify()} exiting={FadeOutUp.springify()}>
      <Card
        onPress={() => navigation.navigate('TaskDetail', {id: item.id})}
        style={[styles.taskCard, item.status === 'done' && {opacity: 0.5}]}>
        <View style={styles.taskRow}>
          <TouchableOpacity
            onPress={() => handleComplete(item.id)}
            style={[
              styles.checkbox,
              {
                borderColor: item.status === 'done' ? theme.colors.success : PRIORITY_COLOR[item.priority],
                backgroundColor: item.status === 'done' ? theme.colors.success : 'transparent',
              },
            ]}
            hitSlop={8}>
            {item.status === 'done' && (
              <CheckSquare size={14} color={theme.colors.textInverse} weight="fill" />
            )}
          </TouchableOpacity>

          <View style={styles.taskInfo}>
            <Text
              style={[
                styles.taskTitle,
                {color: theme.colors.text},
                item.status === 'done' && styles.taskDone,
              ]}
              numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.taskMeta}>
              <View style={[styles.priorityDot, {backgroundColor: PRIORITY_COLOR[item.priority]}]} />
              <Text style={[styles.taskMetaText, {color: theme.colors.textTertiary}]}>
                {item.priority} · +{item.xpReward}xp
              </Text>
              {item.category && (
                <Badge label={item.category} variant="neutral" size="sm" />
              )}
            </View>
          </View>

          <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={8} style={styles.deleteBtn}>
            <Text style={[styles.deleteBtnText, {color: theme.colors.textTertiary}]}>×</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </Animated.View>
  ), [navigation, theme, handleComplete, handleDelete]);

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={[styles.header, {borderBottomColor: theme.colors.borderSubtle}]}>
        <View>
          <Text style={[styles.title, {color: theme.colors.text}]}>Tasks</Text>
          <Text style={[styles.subtitle, {color: theme.colors.textTertiary}]}>
            {activeTasks.length} remaining
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate('XPLevel')}
            style={[styles.xpChip, {backgroundColor: theme.colors.accentMuted}]}>
            <Lightning size={13} color={theme.colors.accent} weight="fill" />
            <Text style={[styles.xpText, {color: theme.colors.accent}]}>
              Lv {stats.level}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('TaskCreate', {})}
            style={[styles.addBtn, {backgroundColor: theme.colors.accent}]}>
            <Plus size={20} color={theme.colors.textInverse} weight="bold" />
          </TouchableOpacity>
        </View>
      </View>

      {/* XP Bar */}
      <View style={styles.xpBarWrapper}>
        <ProgressBar progress={xp.progress} height={4} color={theme.colors.accent} />
        <View style={styles.xpBarRow}>
          <View style={[styles.streakChip, {backgroundColor: '#FF6B3515'}]}>
            <Flame size={12} color="#FF6B35" weight="fill" />
            <Text style={[styles.streakText, {color: '#FF6B35'}]}>
              {stats.currentStreak}d streak
            </Text>
          </View>
          <Text style={[styles.xpBarHint, {color: theme.colors.textTertiary}]}>
            {stats.totalXP.toLocaleString()} XP
          </Text>
        </View>
      </View>

      <FlatList
        data={[...activeTasks, ...completedTasks]}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={<CheckSquare size={28} color={theme.colors.textTertiary} />}
            title="No tasks yet"
            description="Add tasks and earn XP for completing them."
            actionLabel="Add Task"
            onAction={() => navigation.navigate('TaskCreate', {})}
          />
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {fontSize: 24, fontWeight: '700'},
  subtitle: {fontSize: 13, marginTop: 2},
  headerRight: {flexDirection: 'row', alignItems: 'center', gap: 10},
  xpChip: {flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8},
  xpText: {fontSize: 12, fontWeight: '700'},
  addBtn: {width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center'},
  xpBarWrapper: {paddingHorizontal: 20, paddingVertical: 8, gap: 4},
  xpBarRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  streakChip: {flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6},
  streakText: {fontSize: 11, fontWeight: '600'},
  xpBarHint: {fontSize: 11},
  list: {paddingHorizontal: 16, paddingTop: 6, paddingBottom: 32, gap: 8},
  taskCard: {padding: 12},
  taskRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 12},
  checkbox: {width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0},
  taskInfo: {flex: 1, gap: 4},
  taskTitle: {fontSize: 15, fontWeight: '500', lineHeight: 20},
  taskDone: {textDecorationLine: 'line-through'},
  taskMeta: {flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap'},
  priorityDot: {width: 6, height: 6, borderRadius: 3},
  taskMetaText: {fontSize: 12},
  deleteBtn: {padding: 4},
  deleteBtnText: {fontSize: 20, fontWeight: '300'},
});
