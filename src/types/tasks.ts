export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'inProgress' | 'done';
export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'creative' | 'other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  xpReward: number;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  subtasks: SubTask[];
  isRecurring: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly';
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface UserStats {
  totalXP: number;
  level: number;
  tasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
  weeklyXP: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  requirement: number;
  type: 'tasks' | 'streak' | 'xp' | 'journal' | 'habits';
}

export const PRIORITY_XP: Record<TaskPriority, number> = {
  urgent: 50,
  high: 30,
  medium: 15,
  low: 5,
};

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 900, 1400, 2100, 3000, 4200, 5800, 7800,
];

export function getLevelFromXP(xp: number): number {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  return level;
}

export function getXPForNextLevel(currentXP: number): {current: number; next: number; progress: number} {
  const currentLevel = getLevelFromXP(currentXP);
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[currentLevel] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const progress = (currentXP - currentThreshold) / (nextThreshold - currentThreshold);
  return {current: currentXP - currentThreshold, next: nextThreshold - currentThreshold, progress};
}
