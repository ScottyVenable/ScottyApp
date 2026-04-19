import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import {ArrowLeft, SmileyXEyes, SmileySad, SmileyMeh, Smiley, SmileyWink} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks/useTheme';
import {useHaptic} from '../../hooks/useHaptic';
import {storage} from '../../services/storage';
import {generateId} from '../../utils/id';
import {format} from 'date-fns';
import Button from '../../components/ui/Button';

type MoodLevel = 1 | 2 | 3 | 4 | 5;

const MOODS: {level: MoodLevel; label: string; icon: React.ReactNode; color: string}[] = [
  {level: 1, label: 'Rough', icon: null, color: '#EF4444'},
  {level: 2, label: 'Low', icon: null, color: '#F97316'},
  {level: 3, label: 'Okay', icon: null, color: '#EAB308'},
  {level: 4, label: 'Good', icon: null, color: '#22C55E'},
  {level: 5, label: 'Great', icon: null, color: '#7C3AED'},
];

export interface MoodEntry {
  id: string;
  level: MoodLevel;
  note: string;
  createdAt: string;
}

const MOOD_KEY = 'mood_entries';

function getMoodEntries(): MoodEntry[] {
  const raw = storage.getString(MOOD_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as MoodEntry[]; } catch { return []; }
}

export default function MoodTrackerScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const haptic = useHaptic();
  const [selected, setSelected] = useState<MoodLevel | null>(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!selected) return;
    haptic('success');
    const entries = getMoodEntries();
    const entry: MoodEntry = {id: generateId(), level: selected, note: note.trim(), createdAt: new Date().toISOString()};
    storage.set(MOOD_KEY, JSON.stringify([entry, ...entries]));
    setSaved(true);
    setTimeout(() => navigation.goBack(), 600);
  };

  const MoodIcons: Record<MoodLevel, React.ReactNode> = {
    1: <SmileyXEyes size={36} weight="fill" />,
    2: <SmileySad size={36} weight="fill" />,
    3: <SmileyMeh size={36} weight="fill" />,
    4: <Smiley size={36} weight="fill" />,
    5: <SmileyWink size={36} weight="fill" />,
  };

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {borderBottomColor: theme.colors.border}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={22} color={theme.colors.text} weight="bold" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>Mood Check-in</Text>
        <View style={{width: 22}} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.prompt, {color: theme.colors.text}]}>
          How are you feeling right now?
        </Text>
        <Text style={[styles.date, {color: theme.colors.textTertiary}]}>
          {format(new Date(), 'EEEE, MMMM d · h:mm a')}
        </Text>

        <View style={styles.moodsRow}>
          {MOODS.map(m => (
            <TouchableOpacity
              key={m.level}
              onPress={() => { setSelected(m.level); haptic('light'); }}
              style={[
                styles.moodBtn,
                {
                  backgroundColor: selected === m.level ? `${m.color}20` : theme.colors.backgroundSecondary,
                  borderColor: selected === m.level ? m.color : theme.colors.border,
                },
              ]}>
              <View style={{color: m.color} as any}>
                {React.cloneElement(MoodIcons[m.level] as React.ReactElement, {color: selected === m.level ? m.color : theme.colors.textTertiary})}
              </View>
              <Text style={[styles.moodLabel, {color: selected === m.level ? m.color : theme.colors.textTertiary}]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.noteWrapper, {borderColor: theme.colors.border, backgroundColor: theme.colors.backgroundSecondary}]}>
          <TextInput
            style={[styles.noteInput, {color: theme.colors.text}]}
            placeholder="Add a note (optional)..."
            placeholderTextColor={theme.colors.textTertiary}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <Button
          label={saved ? 'Saved!' : 'Save Check-in'}
          onPress={handleSave}
          disabled={!selected || saved}
          fullWidth
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth},
  headerTitle: {fontSize: 16, fontWeight: '600'},
  content: {padding: 24, gap: 20},
  prompt: {fontSize: 22, fontWeight: '700', textAlign: 'center'},
  date: {fontSize: 13, textAlign: 'center'},
  moodsRow: {flexDirection: 'row', gap: 8, justifyContent: 'center'},
  moodBtn: {flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 12, borderWidth: 1.5, gap: 6},
  moodLabel: {fontSize: 11, fontWeight: '600'},
  noteWrapper: {borderRadius: 10, borderWidth: 1, padding: 12},
  noteInput: {fontSize: 15, lineHeight: 22, minHeight: 80},
});
