import {create} from 'zustand';
import {AudioNote} from '../types/audio';
import {storage} from '../services/storage';
import {generateId} from '../utils/id';

const AUDIO_KEY = 'audio_notes';

function load(): AudioNote[] {
  const raw = storage.getString(AUDIO_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as AudioNote[]; } catch { return []; }
}

function save(notes: AudioNote[]) {
  storage.set(AUDIO_KEY, JSON.stringify(notes));
}

interface AudioStore {
  notes: AudioNote[];
  isRecording: boolean;
  isPlaying: boolean;
  currentPlayingId: string | null;
  recordingDuration: number;
  playbackPosition: number;
  playbackDuration: number;

  loadNotes: () => void;
  addNote: (note: Omit<AudioNote, 'id' | 'createdAt'>) => AudioNote;
  updateNote: (id: string, updates: Partial<AudioNote>) => void;
  deleteNote: (id: string) => void;
  setRecording: (isRecording: boolean) => void;
  setPlaying: (isPlaying: boolean, id?: string | null) => void;
  setRecordingDuration: (duration: number) => void;
  setPlaybackPosition: (position: number, duration: number) => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  notes: [],
  isRecording: false,
  isPlaying: false,
  currentPlayingId: null,
  recordingDuration: 0,
  playbackPosition: 0,
  playbackDuration: 0,

  loadNotes: () => {
    const notes = load();
    set({notes});
  },

  addNote: noteData => {
    const note: AudioNote = {
      ...noteData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    set(state => {
      const notes = [note, ...state.notes];
      save(notes);
      return {notes};
    });
    return note;
  },

  updateNote: (id, updates) => {
    set(state => {
      const notes = state.notes.map(n => n.id === id ? {...n, ...updates} : n);
      save(notes);
      return {notes};
    });
  },

  deleteNote: id => {
    set(state => {
      const notes = state.notes.filter(n => n.id !== id);
      save(notes);
      return {notes};
    });
  },

  setRecording: isRecording => set({isRecording, recordingDuration: isRecording ? 0 : get().recordingDuration}),
  setPlaying: (isPlaying, id = null) => set({isPlaying, currentPlayingId: id}),
  setRecordingDuration: recordingDuration => set({recordingDuration}),
  setPlaybackPosition: (playbackPosition, playbackDuration) => set({playbackPosition, playbackDuration}),
}));
