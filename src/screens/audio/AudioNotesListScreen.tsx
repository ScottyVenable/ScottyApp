import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Platform} from 'react-native';
import {Microphone, Stop, Play, Pause, Trash, MicrophoneSlash} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../hooks/useTheme';
import {useAudioStore} from '../../store/audioStore';
import {useHaptic} from '../../hooks/useHaptic';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import {AudioNote} from '../../types/audio';
import {format} from 'date-fns';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function AudioNotesListScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const haptic = useHaptic();
  const {notes, isRecording, recordingDuration, loadNotes, setRecording, setRecordingDuration, addNote, deleteNote} = useAudioStore();
  const [recordTimer, setRecordTimer] = useState<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadNotes();
    return () => { if (recordTimer) clearInterval(recordTimer); };
  }, []);

  const startRecording = async () => {
    haptic('medium');
    setRecording(true);
    setRecordingDuration(0);
    const timer = setInterval(() => {
      useAudioStore.setState(s => ({recordingDuration: s.recordingDuration + 1}));
    }, 1000);
    setRecordTimer(timer);
  };

  const stopRecording = () => {
    haptic('light');
    if (recordTimer) { clearInterval(recordTimer); setRecordTimer(null); }
    const duration = useAudioStore.getState().recordingDuration;
    setRecording(false);
    Alert.prompt
      ? Alert.prompt('Name your recording', 'Enter a title', title => {
          if (title) {
            addNote({title: title || `Recording ${format(new Date(), 'MMM d h:mm a')}`, filePath: '', duration, fileSize: 0, tags: []});
          }
        })
      : addNote({title: `Recording ${format(new Date(), 'MMM d h:mm a')}`, filePath: '', duration, fileSize: 0, tags: []});
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Recording', 'This cannot be undone.', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', style: 'destructive', onPress: () => deleteNote(id)},
    ]);
  };

  const renderNote = ({item}: {item: AudioNote}) => (
    <Card style={styles.noteCard}>
      <View style={styles.noteRow}>
        <View style={[styles.noteIcon, {backgroundColor: theme.colors.accentMuted}]}>
          <Microphone size={18} color={theme.colors.accent} weight="fill" />
        </View>
        <View style={styles.noteInfo}>
          <Text style={[styles.noteTitle, {color: theme.colors.text}]} numberOfLines={1}>{item.title}</Text>
          <Text style={[styles.noteMeta, {color: theme.colors.textTertiary}]}>
            {format(new Date(item.createdAt), 'MMM d, yyyy')} · {formatDuration(item.duration)}
          </Text>
        </View>
        <View style={styles.noteActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AudioNoteDetail', {id: item.id})}
            style={[styles.playBtn, {backgroundColor: theme.colors.backgroundTertiary}]}>
            <Play size={16} color={theme.colors.accent} weight="fill" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={8}>
            <Trash size={16} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  return (
    <ScreenWrapper>
      <View style={[styles.header, {borderBottomColor: theme.colors.borderSubtle}]}>
        <Text style={[styles.title, {color: theme.colors.text}]}>Audio Notes</Text>
      </View>

      {/* Record Button */}
      <View style={styles.recordSection}>
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          style={[
            styles.recordBtn,
            {backgroundColor: isRecording ? theme.colors.error : theme.colors.accent},
          ]}>
          {isRecording ? (
            <Stop size={28} color="#fff" weight="fill" />
          ) : (
            <Microphone size={28} color="#fff" weight="fill" />
          )}
        </TouchableOpacity>
        {isRecording && (
          <View style={styles.recordingInfo}>
            <View style={[styles.recordingDot, {backgroundColor: theme.colors.error}]} />
            <Text style={[styles.recordingTime, {color: theme.colors.error}]}>
              {formatDuration(recordingDuration)}
            </Text>
          </View>
        )}
        <Text style={[styles.recordHint, {color: theme.colors.textTertiary}]}>
          {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
        </Text>
      </View>

      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon={<MicrophoneSlash size={28} color={theme.colors.textTertiary} />}
            title="No recordings yet"
            description="Tap the mic above to record your first audio note."
          />
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth},
  title: {fontSize: 24, fontWeight: '700'},
  recordSection: {alignItems: 'center', paddingVertical: 24, gap: 10},
  recordBtn: {width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center'},
  recordingInfo: {flexDirection: 'row', alignItems: 'center', gap: 6},
  recordingDot: {width: 8, height: 8, borderRadius: 4},
  recordingTime: {fontSize: 18, fontWeight: '700', fontVariant: ['tabular-nums']},
  recordHint: {fontSize: 13},
  list: {paddingHorizontal: 16, paddingBottom: 32, gap: 10},
  noteCard: {padding: 14},
  noteRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  noteIcon: {width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center'},
  noteInfo: {flex: 1},
  noteTitle: {fontSize: 15, fontWeight: '600'},
  noteMeta: {fontSize: 12, marginTop: 2},
  noteActions: {flexDirection: 'row', alignItems: 'center', gap: 10},
  playBtn: {width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center'},
});
