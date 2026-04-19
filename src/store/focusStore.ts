import {create} from 'zustand';
import {storage} from '../services/storage';

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface FocusSession {
  id: string;
  duration: number;
  completedAt: string;
  taskTitle?: string;
  mode: TimerMode;
}

export interface FocusConfig {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  playSound: boolean;
}

const DEFAULT_CONFIG: FocusConfig = {
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  playSound: true,
};

const CONFIG_KEY = 'focus_config';
const SESSIONS_KEY = 'focus_sessions';

interface FocusStore {
  config: FocusConfig;
  mode: TimerMode;
  status: TimerStatus;
  timeRemaining: number;
  sessionsCompleted: number;
  currentTaskTitle: string;
  sessions: FocusSession[];
  todayFocusMinutes: number;

  loadData: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  switchMode: (mode: TimerMode) => void;
  setCurrentTask: (title: string) => void;
  updateConfig: (config: Partial<FocusConfig>) => void;
  completeSession: () => void;
}

export const useFocusStore = create<FocusStore>((set, get) => ({
  config: DEFAULT_CONFIG,
  mode: 'focus',
  status: 'idle',
  timeRemaining: DEFAULT_CONFIG.focusDuration,
  sessionsCompleted: 0,
  currentTaskTitle: '',
  sessions: [],
  todayFocusMinutes: 0,

  loadData: () => {
    const rawConfig = storage.getString(CONFIG_KEY);
    const rawSessions = storage.getString(SESSIONS_KEY);
    const config = rawConfig ? (JSON.parse(rawConfig) as FocusConfig) : DEFAULT_CONFIG;
    const sessions = rawSessions ? (JSON.parse(rawSessions) as FocusSession[]) : [];
    const today = new Date().toDateString();
    const todayFocusMinutes = sessions
      .filter(s => new Date(s.completedAt).toDateString() === today && s.mode === 'focus')
      .reduce((sum, s) => sum + Math.round(s.duration / 60), 0);
    set({config, sessions, timeRemaining: config.focusDuration, todayFocusMinutes});
  },

  startTimer: () => set({status: 'running'}),
  pauseTimer: () => set({status: 'paused'}),

  resetTimer: () => {
    const {config, mode} = get();
    const duration =
      mode === 'focus' ? config.focusDuration :
      mode === 'shortBreak' ? config.shortBreakDuration :
      config.longBreakDuration;
    set({status: 'idle', timeRemaining: duration});
  },

  tick: () => {
    const {timeRemaining} = get();
    if (timeRemaining <= 1) {
      get().completeSession();
    } else {
      set({timeRemaining: timeRemaining - 1});
    }
  },

  switchMode: mode => {
    const {config} = get();
    const duration =
      mode === 'focus' ? config.focusDuration :
      mode === 'shortBreak' ? config.shortBreakDuration :
      config.longBreakDuration;
    set({mode, status: 'idle', timeRemaining: duration});
  },

  setCurrentTask: currentTaskTitle => set({currentTaskTitle}),

  updateConfig: updates => {
    set(state => {
      const config = {...state.config, ...updates};
      storage.set(CONFIG_KEY, JSON.stringify(config));
      return {config};
    });
  },

  completeSession: () => {
    const {mode, config, sessions, sessionsCompleted, currentTaskTitle} = get();
    const session: FocusSession = {
      id: Date.now().toString(),
      duration: mode === 'focus' ? config.focusDuration : mode === 'shortBreak' ? config.shortBreakDuration : config.longBreakDuration,
      completedAt: new Date().toISOString(),
      taskTitle: currentTaskTitle || undefined,
      mode,
    };
    const newSessions = [session, ...sessions];
    storage.set(SESSIONS_KEY, JSON.stringify(newSessions));

    const newCompleted = mode === 'focus' ? sessionsCompleted + 1 : sessionsCompleted;
    const nextMode: TimerMode = mode !== 'focus' ? 'focus' :
      newCompleted % config.sessionsUntilLongBreak === 0 ? 'longBreak' : 'shortBreak';
    const nextDuration = nextMode === 'focus' ? config.focusDuration :
      nextMode === 'shortBreak' ? config.shortBreakDuration : config.longBreakDuration;

    set({
      status: 'completed',
      sessions: newSessions,
      sessionsCompleted: newCompleted,
      mode: nextMode,
      timeRemaining: nextDuration,
    });
  },
}));
