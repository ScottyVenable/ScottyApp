import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, FlatList} from 'react-native';
import {Bug, Gauge, Flag, Database, Trash, Warning} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import {useTheme} from '../../hooks/useTheme';
import {useDevStore, LogEntry} from '../../store/devStore';
import Header from '../../components/layout/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const LOG_COLOR: Record<LogEntry['level'], string> = {
  info: '#3B82F6',
  warn: '#F59E0B',
  error: '#EF4444',
};

export default function DevMenuScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const {featureFlags, logs, setFeatureFlag, clearLogs, isDevMode} = useDevStore();
  const [activeTab, setActiveTab] = useState<'flags' | 'logs' | 'info'>('flags');

  const appVersion = `${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`;
  const systemVersion = DeviceInfo.getSystemVersion();

  const Section = ({title, children}: {title: string; children: React.ReactNode}) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, {color: theme.colors.textSecondary}]}>{title}</Text>
      <View style={[styles.sectionBody, {backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border}]}>
        {children}
      </View>
    </View>
  );

  const FlagRow = ({flag, label, description}: {flag: keyof typeof featureFlags; label: string; description: string}) => (
    <View style={[styles.flagRow, {borderBottomColor: theme.colors.borderSubtle}]}>
      <View style={styles.flagInfo}>
        <Text style={[styles.flagLabel, {color: theme.colors.text}]}>{label}</Text>
        <Text style={[styles.flagDesc, {color: theme.colors.textTertiary}]}>{description}</Text>
      </View>
      <Switch
        value={featureFlags[flag]}
        onValueChange={v => setFeatureFlag(flag, v)}
        trackColor={{false: theme.colors.borderSubtle, true: `${theme.colors.accent}60`}}
        thumbColor={featureFlags[flag] ? theme.colors.accent : theme.colors.textTertiary}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.headerWrapper, {borderBottomColor: theme.colors.border}]}>
        <Header title="Dev Menu" showBack />
        <View style={[styles.devBadge, {backgroundColor: `${theme.colors.warning}20`}]}>
          <Bug size={12} color={theme.colors.warning} />
          <Text style={[styles.devBadgeText, {color: theme.colors.warning}]}>DEV MODE</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, {borderBottomColor: theme.colors.border}]}>
        {([['flags', <Flag size={14} />, 'Feature Flags'], ['logs', <Warning size={14} />, 'Logs'], ['info', <Gauge size={14} />, 'Info']] as const).map(([tab, icon, label]) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && {borderBottomColor: theme.colors.accent, borderBottomWidth: 2}]}>
            {React.cloneElement(icon as React.ReactElement, {color: activeTab === tab ? theme.colors.accent : theme.colors.textTertiary, weight: 'bold'})}
            <Text style={[styles.tabLabel, {color: activeTab === tab ? theme.colors.accent : theme.colors.textTertiary}]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'flags' && (
          <>
            <Section title="FEATURE FLAGS">
              <FlagRow flag="enableAI" label="AI Integration" description="Enable Claude AI features" />
              <FlagRow flag="enableBlog" label="Blog" description="Show blog section" />
              <FlagRow flag="enableMessaging" label="Messaging" description="Enable in-app messaging" />
              <FlagRow flag="enableVoiceTranscription" label="Voice Transcription" description="Auto-transcribe audio notes" />
              <FlagRow flag="enableCloudSync" label="Cloud Sync" description="Sync data to Supabase" />
            </Section>
          </>
        )}

        {activeTab === 'logs' && (
          <View style={styles.section}>
            <View style={styles.logHeader}>
              <Text style={[styles.sectionTitle, {color: theme.colors.textSecondary}]}>
                LOGS ({logs.length})
              </Text>
              <TouchableOpacity onPress={clearLogs} style={[styles.clearBtn, {backgroundColor: `${theme.colors.error}15`}]}>
                <Trash size={14} color={theme.colors.error} />
                <Text style={[styles.clearBtnLabel, {color: theme.colors.error}]}>Clear</Text>
              </TouchableOpacity>
            </View>
            {logs.length === 0 ? (
              <Text style={[styles.emptyLogs, {color: theme.colors.textTertiary}]}>No logs captured</Text>
            ) : (
              <View style={[styles.logList, {backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border}]}>
                {logs.slice(0, 100).map(log => (
                  <View key={log.id} style={[styles.logEntry, {borderBottomColor: theme.colors.borderSubtle}]}>
                    <View style={[styles.logLevel, {backgroundColor: `${LOG_COLOR[log.level]}20`}]}>
                      <Text style={[styles.logLevelText, {color: LOG_COLOR[log.level]}]}>{log.level}</Text>
                    </View>
                    <View style={styles.logBody}>
                      <Text style={[styles.logMsg, {color: theme.colors.text}]} numberOfLines={2}>{log.message}</Text>
                      {log.context && <Text style={[styles.logCtx, {color: theme.colors.textTertiary}]}>{log.context}</Text>}
                      <Text style={[styles.logTime, {color: theme.colors.textTertiary}]}>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === 'info' && (
          <>
            <Section title="APP INFO">
              <InfoRow label="Version" value={appVersion} theme={theme} />
              <InfoRow label="Build" value={__DEV__ ? 'Debug' : 'Release'} theme={theme} />
              <InfoRow label="Environment" value={__DEV__ ? 'Development' : 'Production'} theme={theme} noBorder />
            </Section>
            <Section title="DEVICE INFO">
              <InfoRow label="OS Version" value={systemVersion} theme={theme} />
              <InfoRow label="Bundle ID" value={DeviceInfo.getBundleId()} theme={theme} />
              <InfoRow label="Device" value={DeviceInfo.getModel()} theme={theme} noBorder />
            </Section>
            <Section title="STORAGE">
              <InfoRow label="MMKV" value="Active" theme={theme} noBorder />
            </Section>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({label, value, theme, noBorder}: {label: string; value: string; theme: any; noBorder?: boolean}) {
  return (
    <View style={[styles.infoRow, !noBorder && {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.borderSubtle}]}>
      <Text style={[styles.infoLabel, {color: theme.colors.textSecondary}]}>{label}</Text>
      <Text style={[styles.infoValue, {color: theme.colors.text}]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  headerWrapper: {borderBottomWidth: StyleSheet.hairlineWidth},
  devBadge: {flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginHorizontal: 16, marginBottom: 10},
  devBadgeText: {fontSize: 10, fontWeight: '800', letterSpacing: 1},
  tabs: {flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth},
  tab: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12},
  tabLabel: {fontSize: 12, fontWeight: '600'},
  content: {padding: 16, gap: 20, paddingBottom: 40},
  section: {gap: 8},
  sectionTitle: {fontSize: 11, fontWeight: '700', letterSpacing: 0.8},
  sectionBody: {borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden'},
  flagRow: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth},
  flagInfo: {flex: 1, gap: 2},
  flagLabel: {fontSize: 14, fontWeight: '500'},
  flagDesc: {fontSize: 12},
  logHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  clearBtn: {flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6},
  clearBtnLabel: {fontSize: 12, fontWeight: '600'},
  emptyLogs: {textAlign: 'center', padding: 24, fontSize: 14},
  logList: {borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden'},
  logEntry: {flexDirection: 'row', gap: 10, padding: 10, borderBottomWidth: StyleSheet.hairlineWidth},
  logLevel: {paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', minWidth: 36, alignItems: 'center'},
  logLevelText: {fontSize: 10, fontWeight: '700'},
  logBody: {flex: 1, gap: 2},
  logMsg: {fontSize: 13},
  logCtx: {fontSize: 11},
  logTime: {fontSize: 10},
  infoRow: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12},
  infoLabel: {fontSize: 14},
  infoValue: {fontSize: 14, fontWeight: '500'},
});
