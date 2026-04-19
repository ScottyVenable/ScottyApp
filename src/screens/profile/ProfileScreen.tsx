import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {Gear, ChatCircle, Rss, User, SignOut} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks/useTheme';
import {useAuthStore} from '../../store/authStore';
import {useTaskStore} from '../../store/taskStore';
import {authService} from '../../services/authService';
import Card from '../../components/ui/Card';

export default function ProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const {user} = useAuthStore();
  const {stats} = useTaskStore();

  const initials = (user?.displayName ?? 'S').slice(0, 2).toUpperCase();

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {borderBottomColor: theme.colors.borderSubtle}]}>
        <Text style={[styles.title, {color: theme.colors.text}]}>Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Gear size={22} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar + Name */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, {backgroundColor: theme.colors.accentMuted}]}>
            <Text style={[styles.initials, {color: theme.colors.accent}]}>{initials}</Text>
          </View>
          <Text style={[styles.displayName, {color: theme.colors.text}]}>
            {user?.displayName ?? 'Scotty'}
          </Text>
          <Text style={[styles.username, {color: theme.colors.textSecondary}]}>
            @{user?.username ?? 'scotty'}
          </Text>
          {user?.bio && (
            <Text style={[styles.bio, {color: theme.colors.textSecondary}]}>{user.bio}</Text>
          )}
        </View>

        {/* Stats */}
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, {color: theme.colors.text}]}>{stats.level}</Text>
              <Text style={[styles.statLabel, {color: theme.colors.textTertiary}]}>Level</Text>
            </View>
            <View style={[styles.statDivider, {backgroundColor: theme.colors.border}]} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, {color: theme.colors.text}]}>{stats.totalXP.toLocaleString()}</Text>
              <Text style={[styles.statLabel, {color: theme.colors.textTertiary}]}>Total XP</Text>
            </View>
            <View style={[styles.statDivider, {backgroundColor: theme.colors.border}]} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, {color: theme.colors.text}]}>{stats.tasksCompleted}</Text>
              <Text style={[styles.statLabel, {color: theme.colors.textTertiary}]}>Completed</Text>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <ActionCard
            icon={<Rss size={20} color={theme.colors.accent} weight="fill" />}
            label="Blog"
            description="View and write posts"
            onPress={() => navigation.navigate('BlogFeed')}
            theme={theme}
          />
          <ActionCard
            icon={<ChatCircle size={20} color={theme.colors.accent} weight="fill" />}
            label="Messages"
            description="Your conversations"
            onPress={() => navigation.navigate('ConversationList')}
            theme={theme}
          />
          <ActionCard
            icon={<Gear size={20} color={theme.colors.textSecondary} weight="fill" />}
            label="Settings"
            description="App preferences"
            onPress={() => navigation.navigate('Settings')}
            theme={theme}
          />
        </View>

        <TouchableOpacity onPress={() => authService.logout()} style={[styles.logoutBtn, {borderColor: theme.colors.error}]}>
          <SignOut size={18} color={theme.colors.error} />
          <Text style={[styles.logoutLabel, {color: theme.colors.error}]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionCard({icon, label, description, onPress, theme}: {icon: React.ReactNode; label: string; description: string; onPress: () => void; theme: any}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.actionCard, {backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border}]}>
      <View style={[styles.actionIcon, {backgroundColor: theme.colors.backgroundTertiary}]}>{icon}</View>
      <View style={styles.actionInfo}>
        <Text style={[styles.actionLabel, {color: theme.colors.text}]}>{label}</Text>
        <Text style={[styles.actionDesc, {color: theme.colors.textTertiary}]}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth},
  title: {fontSize: 24, fontWeight: '700'},
  content: {padding: 20, gap: 20, alignItems: 'center'},
  avatarSection: {alignItems: 'center', gap: 6},
  avatar: {width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center'},
  initials: {fontSize: 28, fontWeight: '700'},
  displayName: {fontSize: 20, fontWeight: '700'},
  username: {fontSize: 14},
  bio: {fontSize: 14, textAlign: 'center', lineHeight: 20},
  statsCard: {width: '100%'},
  statsRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 4},
  stat: {flex: 1, alignItems: 'center', gap: 4},
  statValue: {fontSize: 22, fontWeight: '700'},
  statLabel: {fontSize: 12},
  statDivider: {width: 1, height: 36},
  actions: {width: '100%', gap: 10},
  actionCard: {flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth},
  actionIcon: {width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center'},
  actionInfo: {flex: 1},
  actionLabel: {fontSize: 15, fontWeight: '600'},
  actionDesc: {fontSize: 12, marginTop: 2},
  logoutBtn: {flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5},
  logoutLabel: {fontSize: 14, fontWeight: '600'},
});
