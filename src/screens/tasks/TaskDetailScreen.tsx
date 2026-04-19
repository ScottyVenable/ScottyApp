import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {ArrowLeft, Trash, CheckSquare, Lightning} from 'phosphor-react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks/useTheme';
import {useTaskStore} from '../../store/taskStore';
import {TaskStackParamList} from '../../navigation/types';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import {format} from 'date-fns';

export default function TaskDetailScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<TaskStackParamList, 'TaskDetail'>>();
  const {tasks, completeTask, deleteTask} = useTaskStore();
  const task = tasks.find(t => t.id === route.params.id);

  if (!task) return null;

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {borderBottomColor: theme.colors.border}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={22} color={theme.colors.text} weight="bold" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { deleteTask(task.id); navigation.goBack(); }} hitSlop={8}>
          <Trash size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, {color: theme.colors.text}]}>{task.title}</Text>

        <View style={styles.badges}>
          <Badge label={task.priority} variant={task.status === 'done' ? 'neutral' : 'warning'} />
          <Badge label={task.category} variant="neutral" />
          <Badge label={task.status === 'done' ? 'Completed' : task.status} variant={task.status === 'done' ? 'success' : 'accent'} />
        </View>

        {task.description && (
          <Text style={[styles.description, {color: theme.colors.textSecondary}]}>
            {task.description}
          </Text>
        )}

        <View style={[styles.xpCard, {backgroundColor: theme.colors.accentMuted}]}>
          <Lightning size={20} color={theme.colors.accent} weight="fill" />
          <Text style={[styles.xpText, {color: theme.colors.accent}]}>+{task.xpReward} XP reward</Text>
        </View>

        <Text style={[styles.meta, {color: theme.colors.textTertiary}]}>
          Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
        </Text>

        {task.status !== 'done' && (
          <Button
            label="Mark Complete"
            onPress={() => { completeTask(task.id); navigation.goBack(); }}
            fullWidth
            style={styles.completeBtn}
            leftIcon={<CheckSquare size={18} color={theme.colors.textInverse} weight="bold" />}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth},
  content: {padding: 20, gap: 16},
  title: {fontSize: 24, fontWeight: '700', lineHeight: 32},
  badges: {flexDirection: 'row', gap: 8, flexWrap: 'wrap'},
  description: {fontSize: 15, lineHeight: 22},
  xpCard: {flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12},
  xpText: {fontSize: 16, fontWeight: '600'},
  meta: {fontSize: 13},
  completeBtn: {marginTop: 8},
});
