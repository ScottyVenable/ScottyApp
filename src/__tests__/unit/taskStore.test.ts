jest.mock('react-native-mmkv');
jest.mock('react-native-haptic-feedback');
jest.mock('date-fns', () => ({
  ...jest.requireActual('date-fns'),
  isSameDay: jest.fn(() => false),
  isYesterday: jest.fn(() => false),
}));

import {useTaskStore} from '../../store/taskStore';

describe('Task Store', () => {
  beforeEach(() => {
    useTaskStore.setState({
      tasks: [],
      stats: {totalXP: 0, level: 1, tasksCompleted: 0, currentStreak: 0, longestStreak: 0, weeklyXP: 0, achievements: []},
      filter: {},
      searchQuery: '',
      newlyUnlockedAchievement: null,
    });
  });

  test('creates a task with XP reward', () => {
    const {createTask} = useTaskStore.getState();
    createTask({title: 'Test Task', priority: 'high', status: 'todo', category: 'work', tags: [], subtasks: [], isRecurring: false});
    const task = useTaskStore.getState().tasks[0];
    expect(task.xpReward).toBe(30);
    expect(task.title).toBe('Test Task');
  });

  test('completes task and awards XP', () => {
    const {createTask, completeTask} = useTaskStore.getState();
    createTask({title: 'Complete Me', priority: 'medium', status: 'todo', category: 'personal', tags: [], subtasks: [], isRecurring: false});
    const id = useTaskStore.getState().tasks[0].id;
    completeTask(id);
    const {stats} = useTaskStore.getState();
    expect(stats.totalXP).toBe(15);
    expect(stats.tasksCompleted).toBe(1);
  });

  test('deletes a task', () => {
    const {createTask, deleteTask} = useTaskStore.getState();
    createTask({title: 'Delete Me', priority: 'low', status: 'todo', category: 'other', tags: [], subtasks: [], isRecurring: false});
    const id = useTaskStore.getState().tasks[0].id;
    deleteTask(id);
    expect(useTaskStore.getState().tasks).toHaveLength(0);
  });

  test('filters tasks by priority', () => {
    const {createTask, setFilter, getFilteredTasks} = useTaskStore.getState();
    createTask({title: 'Urgent Task', priority: 'urgent', status: 'todo', category: 'work', tags: [], subtasks: [], isRecurring: false});
    createTask({title: 'Low Task', priority: 'low', status: 'todo', category: 'personal', tags: [], subtasks: [], isRecurring: false});
    setFilter({priority: 'urgent'});
    const filtered = useTaskStore.getState().getFilteredTasks();
    expect(filtered).toHaveLength(1);
    expect(filtered[0].priority).toBe('urgent');
  });
});
