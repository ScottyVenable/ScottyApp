import {create} from 'zustand';
import {storage} from '../services/storage';

const DEV_MODE_KEY = 'dev_mode_enabled';

interface DevStore {
  isDevMode: boolean;
  isDevMenuVisible: boolean;
  performanceMetrics: {
    jsFrameRate: number;
    uiFrameRate: number;
    memoryUsage: number;
    renderTime: number;
  };
  featureFlags: {
    enableAI: boolean;
    enableBlog: boolean;
    enableMessaging: boolean;
    enableVoiceTranscription: boolean;
    enableCloudSync: boolean;
  };
  logs: LogEntry[];

  loadDevMode: () => void;
  toggleDevMode: () => void;
  openDevMenu: () => void;
  closeDevMenu: () => void;
  updateMetrics: (metrics: Partial<DevStore['performanceMetrics']>) => void;
  setFeatureFlag: (flag: keyof DevStore['featureFlags'], value: boolean) => void;
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: string;
}

export const useDevStore = create<DevStore>((set, get) => ({
  isDevMode: false,
  isDevMenuVisible: false,
  performanceMetrics: {
    jsFrameRate: 60,
    uiFrameRate: 60,
    memoryUsage: 0,
    renderTime: 0,
  },
  featureFlags: {
    enableAI: false,
    enableBlog: true,
    enableMessaging: true,
    enableVoiceTranscription: false,
    enableCloudSync: false,
  },
  logs: [],

  loadDevMode: () => {
    const val = storage.getBoolean(DEV_MODE_KEY);
    if (val !== undefined) set({isDevMode: val});
  },

  toggleDevMode: () => {
    set(state => {
      const isDevMode = !state.isDevMode;
      storage.set(DEV_MODE_KEY, isDevMode);
      return {isDevMode, isDevMenuVisible: false};
    });
  },

  openDevMenu: () => set({isDevMenuVisible: true}),
  closeDevMenu: () => set({isDevMenuVisible: false}),

  updateMetrics: metrics => {
    set(state => ({
      performanceMetrics: {...state.performanceMetrics, ...metrics},
    }));
  },

  setFeatureFlag: (flag, value) => {
    set(state => ({
      featureFlags: {...state.featureFlags, [flag]: value},
    }));
  },

  addLog: entry => {
    const log: LogEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    set(state => ({
      logs: [log, ...state.logs].slice(0, 200),
    }));
  },

  clearLogs: () => set({logs: []}),
}));
