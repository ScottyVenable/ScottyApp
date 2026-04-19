import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {ArrowLeft, CheckSquare} from 'phosphor-react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks/useTheme';
import {useTaskStore} from '../../store/taskStore';
import {TaskPriority, TaskCategory} from '../../types/tasks';
import {TaskStackParamList} from '../../navigation/types';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const PRIORITIES: TaskPriority[] = ['urgent', 'high', 'medium', 'low'];
const CATEGORIES: TaskCategory[] = ['work', 'personal', 'health', 'learning', 'creative', 'other'];

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  urgent: '#EF4444',
  high: '#F97316',
  medium: '#EAB308',
  low: '#6B7280',
};

export default function TaskCreateScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<TaskStackParamList, 'TaskCreate'>>();
  const {createTask} = useTaskStore();

  const [title, setTitle] = useState(route.params?.prefillTitle ?? '');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [category, setCategory] = useState<TaskCategory>('personal');
  const [errors, setErrors] = useState<{title?: string}>({});

  const handleCreate = () => {
    if (!title.trim()) {
      setErrors({title: 'Title is required'});
      return;
    }
    createTask({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status: 'todo',
      category,
      tags: [],
      subtasks: [],
      isRecurring: false,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {borderBottomColor: theme.colors.border}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={22} color={theme.colors.text} weight="bold" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>New Task</Text>
        <View style={{width: 22}} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input
          label="Task title"
          placeholder="What needs to be done?"
          value={title}
          onChangeText={t => {
            setTitle(t);
            if (errors.title) setErrors({});
          }}
          error={errors.title}
          autoFocus
        />

        <Input
          label="Description (optional)"
          placeholder="Add details..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, {color: theme.colors.textSecondary}]}>Priority</Text>
          <View style={styles.chipRow}>
            {PRIORITIES.map(p => (
              <TouchableOpacity
                key={p}
                onPress={() => setPriority(p)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: priority === p ? `${PRIORITY_COLOR[p]}20` : theme.colors.backgroundSecondary,
                    borderColor: priority === p ? PRIORITY_COLOR[p] : theme.colors.border,
                  },
                ]}>
                <View style={[styles.dot, {backgroundColor: PRIORITY_COLOR[p]}]} />
                <Text style={[styles.chipLabel, {color: priority === p ? PRIORITY_COLOR[p] : theme.colors.textSecondary}]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, {color: theme.colors.textSecondary}]}>Category</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map(c => (
              <TouchableOpacity
                key={c}
                onPress={() => setCategory(c)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: category === c ? theme.colors.accentMuted : theme.colors.backgroundSecondary,
                    borderColor: category === c ? theme.colors.accent : theme.colors.border,
                  },
                ]}>
                <Text style={[styles.chipLabel, {color: category === c ? theme.colors.accent : theme.colors.textSecondary}]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.xpHint, {backgroundColor: theme.colors.accentMuted}]}>
          <CheckSquare size={16} color={theme.colors.accent} weight="fill" />
          <Text style={[styles.xpHintText, {color: theme.colors.accent}]}>
            Complete this task to earn {priority === 'urgent' ? 50 : priority === 'high' ? 30 : priority === 'medium' ? 15 : 5} XP
          </Text>
        </View>

        <Button label="Create Task" onPress={handleCreate} fullWidth style={styles.createBtn} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth},
  headerTitle: {fontSize: 16, fontWeight: '600'},
  content: {padding: 20, gap: 20},
  section: {gap: 10},
  sectionLabel: {fontSize: 13, fontWeight: '600'},
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  chip: {flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, borderWidth: 1},
  dot: {width: 7, height: 7, borderRadius: 3.5},
  chipLabel: {fontSize: 13, fontWeight: '500', textTransform: 'capitalize'},
  xpHint: {flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10},
  xpHintText: {fontSize: 13, fontWeight: '500'},
  createBtn: {marginTop: 8},
});
