import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {ArrowLeft, Play, Pause, Trash} from 'phosphor-react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks/useTheme';
import {useAudioStore} from '../../store/audioStore';
import {ToolsStackParamList} from '../../navigation/types';
import {format} from 'date-fns';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function AudioNoteDetailScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ToolsStackParamList, 'AudioNoteDetail'>>();
  const {notes, isPlaying, currentPlayingId, setPlaying, deleteNote} = useAudioStore();
  const note = notes.find(n => n.id === route.params.id);

  if (!note) return null;
  const isThisPlaying = isPlaying && currentPlayingId === note.id;

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {borderBottomColor: theme.colors.border}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={22} color={theme.colors.text} weight="bold" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { deleteNote(note.id); navigation.goBack(); }} hitSlop={8}>
          <Trash size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, {color: theme.colors.text}]}>{note.title}</Text>
        <Text style={[styles.meta, {color: theme.colors.textTertiary}]}>
          {format(new Date(note.createdAt), 'MMMM d, yyyy · h:mm a')} · {formatDuration(note.duration)}
        </Text>

        <View style={[styles.playerCard, {backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border}]}>
          <View style={[styles.waveform, {backgroundColor: theme.colors.backgroundTertiary}]}>
            <Text style={[styles.waveformPlaceholder, {color: theme.colors.textTertiary}]}>
              Audio waveform
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setPlaying(!isThisPlaying, isThisPlaying ? null : note.id)}
            style={[styles.playBtn, {backgroundColor: theme.colors.accent}]}>
            {isThisPlaying ? (
              <Pause size={28} color="#fff" weight="fill" />
            ) : (
              <Play size={28} color="#fff" weight="fill" />
            )}
          </TouchableOpacity>

          <Text style={[styles.duration, {color: theme.colors.textSecondary}]}>
            {formatDuration(note.duration)}
          </Text>
        </View>

        {note.transcript && (
          <View style={[styles.transcript, {backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border}]}>
            <Text style={[styles.transcriptLabel, {color: theme.colors.textSecondary}]}>Transcript</Text>
            <Text style={[styles.transcriptText, {color: theme.colors.text}]}>{note.transcript}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth},
  content: {padding: 20, gap: 16},
  title: {fontSize: 22, fontWeight: '700'},
  meta: {fontSize: 13},
  playerCard: {borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, padding: 20, alignItems: 'center', gap: 16},
  waveform: {width: '100%', height: 60, borderRadius: 8, alignItems: 'center', justifyContent: 'center'},
  waveformPlaceholder: {fontSize: 12},
  playBtn: {width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center'},
  duration: {fontSize: 14, fontWeight: '600'},
  transcript: {borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, padding: 14, gap: 6},
  transcriptLabel: {fontSize: 12, fontWeight: '600'},
  transcriptText: {fontSize: 14, lineHeight: 22},
});
