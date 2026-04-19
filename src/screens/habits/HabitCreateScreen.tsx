import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {ArrowLeft} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks/useTheme';
import {useHabitStore, HabitCategory, HabitFrequency} from '../../store/habitStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const COLORS = ['#7C3AED', '#2563EB', '#16A34A', '#D97706', '#DC2626', '#0891B2', '#7C3AED', '#DB2777'];
const CATEGORIES: HabitCategory[] = ['health', 'mind', 'productivity', 'creative', 'social', 'other'];
const FREQUENCIES: HabitFrequency[] = ['daily', 'weekdays', 'weekends'];

export default function HabitCreateScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const {createHabit} = useHabitStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [category, setCategory] = useState<HabitCategory>('health');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [error, setError] = useState('');

  const handleCreate = () => {
    if (!title.trim()) { setError('Name is required'); return; }
    createHabit({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      frequency,
      color,
      icon: 'Heartbeat',
      targetDays: frequency === 'daily' ? 7 : frequency === 'weekdays' ? 5 : 2,
      xpReward: 10,
      isArchived: false,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {borderBottomColor: theme.colors.border}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={22} color={theme.colors.text} weight="bold" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>New Habit</Text>
        <View style={{width: 22}} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input label="Habit name" placeholder="e.g. Morning workout" value={title} onChangeText={v => {setTitle(v); setError('');}} error={error} autoFocus />
        <Input label="Description (optional)" placeholder="Why is this important?" value={description} onChangeText={setDescription} multiline />

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, {color: theme.colors.textSecondary}]}>Color</Text>
          <View style={styles.colorRow}>
            {COLORS.map(c => (
              <TouchableOpacity
                key={c}
                onPress={() => setColor(c)}
                style={[styles.colorDot, {backgroundColor: c, borderWidth: color === c ? 3 : 0, borderColor: '#fff'}]}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, {color: theme.colors.textSecondary}]}>Frequency</Text>
          <View style={styles.chipRow}>
            {FREQUENCIES.map(f => (
              <TouchableOpacity
                key={f}
                onPress={() => setFrequency(f)}
                style={[styles.chip, {backgroundColor: frequency === f ? theme.colors.accentMuted : theme.colors.backgroundSecondary, borderColor: frequency === f ? theme.colors.accent : theme.colors.border}]}>
                <Text style={[styles.chipLabel, {color: frequency === f ? theme.colors.accent : theme.colors.textSecondary}]}>
                  {f}
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
                style={[styles.chip, {backgroundColor: category === c ? theme.colors.accentMuted : theme.colors.backgroundSecondary, borderColor: category === c ? theme.colors.accent : theme.colors.border}]}>
                <Text style={[styles.chipLabel, {color: category === c ? theme.colors.accent : theme.colors.textSecondary}]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button label="Create Habit" onPress={handleCreate} fullWidth />
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
  colorRow: {flexDirection: 'row', gap: 10},
  colorDot: {width: 32, height: 32, borderRadius: 16},
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  chip: {paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1},
  chipLabel: {fontSize: 13, fontWeight: '500', textTransform: 'capitalize'},
});
