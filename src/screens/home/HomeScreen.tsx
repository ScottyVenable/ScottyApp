import React, {useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Lightning,
  Flame,
  BookOpen,
  CheckSquare,
  Timer,
  Heartbeat,
  Bug,
  BellSimple,
  ChatCircle,
} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../hooks/useTheme';
import {useTaskStore} from '../../store/taskStore';
import {useJournalStore} from '../../store/journalStore';
import {useHabitStore} from '../../store/habitStore';
import {useDevStore} from '../../store/devStore';
import {useAuthStore} from '../../store/authStore';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import {getXPForNextLevel} from '../../types/tasks';
import {format} from 'date-fns';

export default function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const {stats, loadData: loadTasks} = useTaskStore();
  const {entries, loadEntries} = useJournalStore();
  const {habits, loadHabits, isCompletedToday} = useHabitStore();
  const {isDevMode, toggleDevMode} = useDevStore();
  const {user} = useAuthStore();

  useEffect(() => {
    loadTasks();
    loadEntries();
    loadHabits();
  }, []);

  const xpProgress = getXPForNextLevel(stats.totalXP);
  const todayHabitsCompleted = habits.filter(h => !h.isArchived && isCompletedToday(h)).length;
  const totalTodayHabits = habits.filter(h => !h.isArchived).length;
  const greeting = getGreeting();
  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, {color: theme.colors.textSecondary}]}>{greeting}</Text>
            <Text style={[styles.name, {color: theme.colors.text}]}>
              {user?.displayName || 'Scotty'}
            </Text>
            <Text style={[styles.date, {color: theme.colors.textTertiary}]}>{today}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Profile', {screen: 'ConversationList'})}>
              <ChatCircle size={22} color={theme.colors.textSecondary} weight="bold" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <BellSimple size={22} color={theme.colors.textSecondary} weight="bold" />
            </TouchableOpacity>
          </View>
        </View>

        {/* XP / Level Card */}
        <Card style={styles.xpCard} elevated>
          <View style={styles.xpRow}>
            <View style={styles.xpLeft}>
              <View style={[styles.levelBadge, {backgroundColor: theme.colors.accentMuted}]}>
                <Lightning size={14} color={theme.colors.accent} weight="fill" />
                <Text style={[styles.levelText, {color: theme.colors.accent}]}>
                  Lv {stats.level}
                </Text>
              </View>
              <Text style={[styles.xpTotal, {color: theme.colors.text}]}>
                {stats.totalXP.toLocaleString()} XP
              </Text>
            </View>
            <View style={[styles.streakBadge, {backgroundColor: '#FF6B3520'}]}>
              <Flame size={14} color="#FF6B35" weight="fill" />
              <Text style={[styles.streakText, {color: '#FF6B35'}]}>
                {stats.currentStreak} day streak
              </Text>
            </View>
          </View>
          <ProgressBar
            progress={xpProgress.progress}
            height={6}
            style={styles.xpBar}
            color={theme.colors.accent}
          />
          <Text style={[styles.xpHint, {color: theme.colors.textTertiary}]}>
            {xpProgress.current} / {xpProgress.next} XP to level {stats.level + 1}
          </Text>
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <StatCard
            icon={<CheckSquare size={20} color={theme.colors.accent} weight="fill" />}
            value={stats.tasksCompleted.toString()}
            label="Tasks Done"
            onPress={() => navigation.navigate('Tasks')}
            theme={theme}
          />
          <StatCard
            icon={<BookOpen size={20} color={theme.colors.accent} weight="fill" />}
            value={entries.length.toString()}
            label="Journal"
            onPress={() => navigation.navigate('Journal')}
            theme={theme}
          />
          <StatCard
            icon={<Heartbeat size={20} color={theme.colors.accent} weight="fill" />}
            value={`${todayHabitsCompleted}/${totalTodayHabits}`}
            label="Habits"
            onPress={() => navigation.navigate('Tools', {screen: 'HabitList'})}
            theme={theme}
          />
          <StatCard
            icon={<Timer size={20} color={theme.colors.accent} weight="fill" />}
            value="Focus"
            label="Timer"
            onPress={() => navigation.navigate('Tools', {screen: 'FocusTimer'})}
            theme={theme}
          />
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, {color: theme.colors.textSecondary}]}>
          QUICK ACTIONS
        </Text>
        <View style={styles.quickActions}>
          <QuickAction
            label="New Task"
            icon={<CheckSquare size={18} color={theme.colors.accent} weight="bold" />}
            onPress={() => navigation.navigate('Tasks', {screen: 'TaskCreate'})}
            theme={theme}
          />
          <QuickAction
            label="New Entry"
            icon={<BookOpen size={18} color={theme.colors.accent} weight="bold" />}
            onPress={() => navigation.navigate('Journal', {screen: 'JournalEditor'})}
            theme={theme}
          />
          <QuickAction
            label="Focus"
            icon={<Timer size={18} color={theme.colors.accent} weight="bold" />}
            onPress={() => navigation.navigate('Tools', {screen: 'FocusTimer'})}
            theme={theme}
          />
        </View>

        {/* Dev Mode Toggle */}
        {__DEV__ && (
          <View style={[styles.devToggle, {borderColor: theme.colors.borderSubtle, backgroundColor: theme.colors.backgroundSecondary}]}>
            <View style={styles.devToggleLeft}>
              <Bug size={16} color={isDevMode ? theme.colors.warning : theme.colors.textTertiary} />
              <Text style={[styles.devToggleLabel, {color: isDevMode ? theme.colors.warning : theme.colors.textSecondary}]}>
                Developer Mode
              </Text>
            </View>
            <Switch
              value={isDevMode}
              onValueChange={val => {
                toggleDevMode();
                if (val) navigation.navigate('Profile', {screen: 'DevMenu'});
              }}
              trackColor={{false: theme.colors.borderSubtle, true: `${theme.colors.warning}60`}}
              thumbColor={isDevMode ? theme.colors.warning : theme.colors.textTertiary}
            />
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenWrapper>
  );
}

function StatCard({icon, value, label, onPress, theme}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <TouchableOpacity
      style={[styles.statCard, {backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border}]}
      onPress={onPress}
      activeOpacity={0.7}>
      {icon}
      <Text style={[styles.statValue, {color: theme.colors.text}]}>{value}</Text>
      <Text style={[styles.statLabel, {color: theme.colors.textTertiary}]}>{label}</Text>
    </TouchableOpacity>
  );
}

function QuickAction({label, icon, onPress, theme}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <TouchableOpacity
      style={[styles.quickActionBtn, {backgroundColor: theme.colors.accentMuted, borderColor: `${theme.colors.accent}30`}]}
      onPress={onPress}
      activeOpacity={0.7}>
      {icon}
      <Text style={[styles.quickActionLabel, {color: theme.colors.accent}]}>{label}</Text>
    </TouchableOpacity>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  return 'Good evening,';
}

const styles = StyleSheet.create({
  scroll: {flex: 1},
  content: {padding: 20, gap: 16},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 8},
  headerActions: {flexDirection: 'row', gap: 4},
  iconBtn: {padding: 8},
  greeting: {fontSize: 13, fontWeight: '500'},
  name: {fontSize: 26, fontWeight: '700', marginTop: 2},
  date: {fontSize: 13, marginTop: 2},
  xpCard: {gap: 10},
  xpRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  xpLeft: {gap: 4},
  levelBadge: {flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start'},
  levelText: {fontSize: 12, fontWeight: '700'},
  xpTotal: {fontSize: 20, fontWeight: '700'},
  streakBadge: {flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8},
  streakText: {fontSize: 13, fontWeight: '600'},
  xpBar: {},
  xpHint: {fontSize: 11},
  statsRow: {flexDirection: 'row', gap: 10},
  statCard: {flex: 1, alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, gap: 4},
  statValue: {fontSize: 18, fontWeight: '700'},
  statLabel: {fontSize: 11},
  sectionTitle: {fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginTop: 4},
  quickActions: {flexDirection: 'row', gap: 10},
  quickActionBtn: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 10, borderWidth: 1},
  quickActionLabel: {fontSize: 13, fontWeight: '600'},
  devToggle: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 10, borderWidth: 1},
  devToggleLeft: {flexDirection: 'row', alignItems: 'center', gap: 8},
  devToggleLabel: {fontSize: 13, fontWeight: '500'},
  bottomSpacer: {height: 16},
});
