import {create} from 'zustand';
import {Task, TaskPriority, TaskStatus, TaskCategory, UserStats, Achievement, PRIORITY_XP, getLevelFromXP} from '../types/tasks';
import {storage} from '../services/storage';
import {generateId} from '../utils/id';
import {isSameDay, isYesterday} from 'date-fns';

const TASKS_KEY = 'app_tasks';
const STATS_KEY = 'app_user_stats';

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {id: 'first_task', title: 'First Steps', description: 'Complete your first task', icon: 'Star', unlockedAt: undefined, isUnlocked: false, requirement: 1, type: 'tasks'},
  {id: 'five_tasks', title: 'Getting Started', description: 'Complete 5 tasks', icon: 'Trophy', unlockedAt: undefined, isUnlocked: false, requirement: 5, type: 'tasks'},
  {id: 'fifty_tasks', title: 'On a Roll', description: 'Complete 50 tasks', icon: 'Crown', unlockedAt: undefined, isUnlocked: false, requirement: 50, type: 'tasks'},
  {id: 'streak_3', title: 'Consistent', description: '3-day streak', icon: 'Flame', unlockedAt: undefined, isUnlocked: false, requirement: 3, type: 'streak'},
  {id: 'streak_7', title: 'Week Warrior', description: '7-day streak', icon: 'Lightning', unlockedAt: undefined, isUnlocked: false, requirement: 7, type: 'streak'},
  {id: 'streak_30', title: 'Iron Will', description: '30-day streak', icon: 'Medal', unlockedAt: undefined, isUnlocked: false, requirement: 30, type: 'streak'},
  {id: 'xp_500', title: 'XP Collector', description: 'Earn 500 XP', icon: 'Sparkle', unlockedAt: undefined, isUnlocked: false, requirement: 500, type: 'xp'},
  {id: 'xp_1000', title: 'Power User', description: 'Earn 1000 XP', icon: 'Rocket', unlockedAt: undefined, isUnlocked: false, requirement: 1000, type: 'xp'},
];

const DEFAULT_STATS: UserStats = {
  totalXP: 0,
  level: 1,
  tasksCompleted: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: undefined,
  weeklyXP: 0,
  achievements: DEFAULT_ACHIEVEMENTS,
};

function loadTasks(): Task[] {
  const raw = storage.getString(TASKS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as Task[]; } catch { return []; }
}

function loadStats(): UserStats {
  const raw = storage.getString(STATS_KEY);
  if (!raw) return DEFAULT_STATS;
  try { return JSON.parse(raw) as UserStats; } catch { return DEFAULT_STATS; }
}

function save(tasks: Task[], stats: UserStats) {
  storage.set(TASKS_KEY, JSON.stringify(tasks));
  storage.set(STATS_KEY, JSON.stringify(stats));
}

function updateStreak(stats: UserStats): UserStats {
  const now = new Date();
  const last = stats.lastCompletedDate ? new Date(stats.lastCompletedDate) : null;

  if (!last) {
    return {...stats, currentStreak: 1, longestStreak: Math.max(1, stats.longestStreak), lastCompletedDate: now.toISOString()};
  }

  if (isSameDay(now, last)) {
    return stats;
  }

  if (isYesterday(last)) {
    const streak = stats.currentStreak + 1;
    return {
      ...stats,
      currentStreak: streak,
      longestStreak: Math.max(streak, stats.longestStreak),
      lastCompletedDate: now.toISOString(),
    };
  }

  return {
    ...stats,
    currentStreak: 1,
    longestStreak: Math.max(1, stats.longestStreak),
    lastCompletedDate: now.toISOString(),
  };
}

function checkAchievements(stats: UserStats): UserStats {
  const achievements = stats.achievements.map(a => {
    if (a.isUnlocked) return a;
    let met = false;
    switch (a.type) {
      case 'tasks': met = stats.tasksCompleted >= a.requirement; break;
      case 'streak': met = stats.currentStreak >= a.requirement; break;
      case 'xp': met = stats.totalXP >= a.requirement; break;
    }
    if (met) return {...a, isUnlocked: true, unlockedAt: new Date().toISOString()};
    return a;
  });
  return {...stats, achievements};
}

interface TaskStore {
  tasks: Task[];
  stats: UserStats;
  filter: {status?: TaskStatus; category?: TaskCategory; priority?: TaskPriority};
  searchQuery: string;
  newlyUnlockedAchievement: Achievement | null;

  loadData: () => void;
  createTask: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'xpReward'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  setFilter: (filter: TaskStore['filter']) => void;
  setSearchQuery: (q: string) => void;
  clearNewAchievement: () => void;
  getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  stats: DEFAULT_STATS,
  filter: {},
  searchQuery: '',
  newlyUnlockedAchievement: null,

  loadData: () => {
    const tasks = loadTasks();
    const stats = loadStats();
    set({tasks, stats});
  },

  createTask: data => {
    const xpReward = PRIORITY_XP[data.priority];
    const now = new Date().toISOString();
    const task: Task = {
      ...data,
      id: generateId(),
      xpReward,
      createdAt: now,
      updatedAt: now,
    };
    set(state => {
      const tasks = [task, ...state.tasks];
      save(tasks, state.stats);
      return {tasks};
    });
    return task;
  },

  updateTask: (id, updates) => {
    set(state => {
      const tasks = state.tasks.map(t =>
        t.id === id ? {...t, ...updates, updatedAt: new Date().toISOString()} : t,
      );
      save(tasks, state.stats);
      return {tasks};
    });
  },

  completeTask: id => {
    set(state => {
      const task = state.tasks.find(t => t.id === id);
      if (!task || task.status === 'done') return state;

      const tasks = state.tasks.map(t =>
        t.id === id
          ? {...t, status: 'done' as TaskStatus, completedAt: new Date().toISOString(), updatedAt: new Date().toISOString()}
          : t,
      );

      let stats = updateStreak({
        ...state.stats,
        totalXP: state.stats.totalXP + task.xpReward,
        tasksCompleted: state.stats.tasksCompleted + 1,
        weeklyXP: state.stats.weeklyXP + task.xpReward,
      });
      stats.level = getLevelFromXP(stats.totalXP);

      const prevAchievements = stats.achievements;
      stats = checkAchievements(stats);

      const newUnlock = stats.achievements.find(
        (a, i) => a.isUnlocked && !prevAchievements[i].isUnlocked,
      );

      save(tasks, stats);
      return {tasks, stats, newlyUnlockedAchievement: newUnlock ?? null};
    });
  },

  deleteTask: id => {
    set(state => {
      const tasks = state.tasks.filter(t => t.id !== id);
      save(tasks, state.stats);
      return {tasks};
    });
  },

  setFilter: filter => set({filter}),
  setSearchQuery: searchQuery => set({searchQuery}),
  clearNewAchievement: () => set({newlyUnlockedAchievement: null}),

  getFilteredTasks: () => {
    const {tasks, filter, searchQuery} = get();
    let filtered = [...tasks];

    if (filter.status) filtered = filtered.filter(t => t.status === filter.status);
    if (filter.category) filtered = filtered.filter(t => t.category === filter.category);
    if (filter.priority) filtered = filtered.filter(t => t.priority === filter.priority);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => t.title.toLowerCase().includes(q));
    }

    const order: Record<TaskPriority, number> = {urgent: 0, high: 1, medium: 2, low: 3};
    return filtered.sort((a, b) => {
      if (a.status === 'done' && b.status !== 'done') return 1;
      if (a.status !== 'done' && b.status === 'done') return -1;
      return order[a.priority] - order[b.priority];
    });
  },
}));
