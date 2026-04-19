import {create} from 'zustand';
import {storage} from '../services/storage';
import {generateId} from '../utils/id';
import {isSameDay, startOfDay, eachDayOfInterval, subDays} from 'date-fns';

export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom';
export type HabitCategory = 'health' | 'mind' | 'productivity' | 'creative' | 'social' | 'other';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  customDays?: number[];
  color: string;
  icon: string;
  targetDays: number;
  completedDates: string[];
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
  xpReward: number;
  isArchived: boolean;
}

const HABITS_KEY = 'app_habits';

function load(): Habit[] {
  const raw = storage.getString(HABITS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as Habit[]; } catch { return []; }
}

function save(habits: Habit[]) {
  storage.set(HABITS_KEY, JSON.stringify(habits));
}

function calculateStreak(completedDates: string[]): {current: number; longest: number} {
  if (completedDates.length === 0) return {current: 0, longest: 0};
  const sorted = [...completedDates].sort().map(d => startOfDay(new Date(d)));
  const today = startOfDay(new Date());
  let current = 0;
  let longest = 0;
  let streak = 0;
  let prev: Date | null = null;

  for (const d of sorted) {
    if (prev && (d.getTime() - prev.getTime()) === 86400000) {
      streak++;
    } else {
      streak = 1;
    }
    longest = Math.max(longest, streak);
    prev = d;
  }

  const last = sorted[sorted.length - 1];
  if (isSameDay(last, today) || isSameDay(last, subDays(today, 1))) {
    current = streak;
  }
  return {current, longest};
}

interface HabitStore {
  habits: Habit[];
  selectedDate: string;

  loadHabits: () => void;
  createHabit: (data: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'currentStreak' | 'longestStreak'>) => Habit;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (id: string, date?: string) => void;
  setSelectedDate: (date: string) => void;
  isCompletedToday: (habit: Habit) => boolean;
  getWeekData: (habit: Habit) => {date: string; completed: boolean}[];
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  selectedDate: new Date().toISOString(),

  loadHabits: () => {
    const habits = load();
    set({habits});
  },

  createHabit: data => {
    const habit: Habit = {
      ...data,
      id: generateId(),
      completedDates: [],
      currentStreak: 0,
      longestStreak: 0,
      createdAt: new Date().toISOString(),
    };
    set(state => {
      const habits = [...state.habits, habit];
      save(habits);
      return {habits};
    });
    return habit;
  },

  updateHabit: (id, updates) => {
    set(state => {
      const habits = state.habits.map(h => h.id === id ? {...h, ...updates} : h);
      save(habits);
      return {habits};
    });
  },

  deleteHabit: id => {
    set(state => {
      const habits = state.habits.filter(h => h.id !== id);
      save(habits);
      return {habits};
    });
  },

  toggleCompletion: (id, date) => {
    const today = date ?? startOfDay(new Date()).toISOString();
    set(state => {
      const habits = state.habits.map(h => {
        if (h.id !== id) return h;
        const alreadyDone = h.completedDates.some(d => isSameDay(new Date(d), new Date(today)));
        const completedDates = alreadyDone
          ? h.completedDates.filter(d => !isSameDay(new Date(d), new Date(today)))
          : [...h.completedDates, today];
        const {current, longest} = calculateStreak(completedDates);
        return {...h, completedDates, currentStreak: current, longestStreak: longest};
      });
      save(habits);
      return {habits};
    });
  },

  setSelectedDate: selectedDate => set({selectedDate}),

  isCompletedToday: habit => {
    const today = startOfDay(new Date());
    return habit.completedDates.some(d => isSameDay(new Date(d), today));
  },

  getWeekData: habit => {
    const today = new Date();
    const days = eachDayOfInterval({start: subDays(today, 6), end: today});
    return days.map(day => ({
      date: day.toISOString(),
      completed: habit.completedDates.some(d => isSameDay(new Date(d), day)),
    }));
  },
}));
