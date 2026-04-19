import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {ArrowLeft, Lightning, Flame, Trophy, Medal} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks/useTheme';
import {useTaskStore} from '../../store/taskStore';
import ProgressBar from '../../components/ui/ProgressBar';
import Card from '../../components/ui/Card';
import {getXPForNextLevel, LEVEL_THRESHOLDS} from '../../types/tasks';

export default function XPLevelScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const {stats} = useTaskStore();
  const xp = getXPForNextLevel(stats.totalXP);

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {borderBottomColor: theme.colors.border}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={22} color={theme.colors.text} weight="bold" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>Progress</Text>
        <View style={{width: 22}} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Level Display */}
        <View style={[styles.levelCard, {backgroundColor: theme.colors.accentMuted}]}>
          <Lightning size={40} color={theme.colors.accent} weight="fill" />
          <Text style={[styles.levelNum, {color: theme.colors.accent}]}>Level {stats.level}</Text>
          <Text style={[styles.totalXP, {color: theme.colors.text}]}>
            {stats.totalXP.toLocaleString()} total XP
          </Text>
          <ProgressBar progress={xp.progress} height={8} color={theme.colors.accent} style={styles.xpBar} />
          <Text style={[styles.xpHint, {color: theme.colors.textSecondary}]}>
            {xp.current} / {xp.next} XP to Level {stats.level + 1}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <StatBox icon={<Flame size={22} color="#FF6B35" weight="fill" />} value={stats.currentStreak} label="Day Streak" color="#FF6B35" theme={theme} />
          <StatBox icon={<Trophy size={22} color="#FFD700" weight="fill" />} value={stats.tasksCompleted} label="Completed" color="#FFD700" theme={theme} />
          <StatBox icon={<Lightning size={22} color={theme.colors.accent} weight="fill" />} value={stats.weeklyXP} label="Week XP" color={theme.colors.accent} theme={theme} />
          <StatBox icon={<Medal size={22} color="#CD7F32" weight="fill" />} value={stats.longestStreak} label="Best Streak" color="#CD7F32" theme={theme} />
        </View>

        {/* Achievements */}
        <Text style={[styles.sectionTitle, {color: theme.colors.textSecondary}]}>ACHIEVEMENTS</Text>
        <View style={styles.achievements}>
          {stats.achievements.map(a => (
            <Card key={a.id} style={[styles.achievementCard, !a.isUnlocked && {opacity: 0.4}]}>
              <View style={[styles.achievementIcon, {backgroundColor: a.isUnlocked ? theme.colors.accentMuted : theme.colors.backgroundTertiary}]}>
                <Lightning size={20} color={a.isUnlocked ? theme.colors.accent : theme.colors.textTertiary} weight="fill" />
              </View>
              <View style={styles.achievementInfo}>
                <Text style={[styles.achievementTitle, {color: theme.colors.text}]}>{a.title}</Text>
                <Text style={[styles.achievementDesc, {color: theme.colors.textTertiary}]}>{a.description}</Text>
              </View>
              {a.isUnlocked && <Trophy size={16} color="#FFD700" weight="fill" />}
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({icon, value, label, color, theme}: {
  icon: React.ReactNode; value: number; label: string; color: string; theme: any;
}) {
  return (
    <View style={[styles.statBox, {backgroundColor: `${color}15`, borderColor: `${color}30`}]}>
      {icon}
      <Text style={[styles.statValue, {color: theme.colors.text}]}>{value.toLocaleString()}</Text>
      <Text style={[styles.statLabel, {color: theme.colors.textTertiary}]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth},
  headerTitle: {fontSize: 16, fontWeight: '600'},
  content: {padding: 20, gap: 20},
  levelCard: {alignItems: 'center', padding: 28, borderRadius: 20, gap: 8},
  levelNum: {fontSize: 36, fontWeight: '800'},
  totalXP: {fontSize: 15, fontWeight: '500'},
  xpBar: {width: '100%'},
  xpHint: {fontSize: 13},
  statsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12},
  statBox: {flex: 1, minWidth: '45%', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, gap: 4},
  statValue: {fontSize: 24, fontWeight: '700'},
  statLabel: {fontSize: 12},
  sectionTitle: {fontSize: 11, fontWeight: '700', letterSpacing: 0.8},
  achievements: {gap: 8},
  achievementCard: {flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14},
  achievementIcon: {width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center'},
  achievementInfo: {flex: 1},
  achievementTitle: {fontSize: 14, fontWeight: '600'},
  achievementDesc: {fontSize: 12, marginTop: 2},
});
