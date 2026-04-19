import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch} from 'react-native';
import {
  PaintBrush, Bell, ShieldCheck, Info, SignOut,
  Vibrate, Moon, ChevronRight,
} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme, useThemeConfig, useThemeActions} from '../../hooks/useTheme';
import {authService} from '../../services/authService';
import Header from '../../components/layout/Header';

export default function SettingsScreen() {
  const theme = useTheme();
  const config = useThemeConfig();
  const {setHapticFeedback} = useThemeActions();
  const navigation = useNavigation<any>();

  const Section = ({title, children}: {title: string; children: React.ReactNode}) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, {color: theme.colors.textSecondary}]}>{title}</Text>
      <View style={[styles.sectionBody, {backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border}]}>
        {children}
      </View>
    </View>
  );

  const Row = ({icon, label, onPress, right, noBorder}: {icon: React.ReactNode; label: string; onPress?: () => void; right?: React.ReactNode; noBorder?: boolean}) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress && !right}
      activeOpacity={0.7}
      style={[styles.row, !noBorder && {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.border}]}>
      <View style={styles.rowLeft}>
        <View style={[styles.rowIcon, {backgroundColor: theme.colors.backgroundTertiary}]}>{icon}</View>
        <Text style={[styles.rowLabel, {color: theme.colors.text}]}>{label}</Text>
      </View>
      {right ?? <ChevronRight size={16} color={theme.colors.textTertiary} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <Header title="Settings" showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Section title="APPEARANCE">
          <Row
            icon={<PaintBrush size={16} color={theme.colors.accent} />}
            label="Theme Creator"
            onPress={() => navigation.navigate('ThemeCreator')}
          />
          <Row
            icon={<Moon size={16} color={theme.colors.accent} />}
            label="Dark Mode"
            noBorder
            right={
              <Switch
                value={config.mode === 'dark'}
                onValueChange={v => useThemeActions.prototype?.setMode?.(v ? 'dark' : 'light')}
                trackColor={{false: theme.colors.borderSubtle, true: `${theme.colors.accent}60`}}
                thumbColor={config.mode === 'dark' ? theme.colors.accent : theme.colors.textTertiary}
              />
            }
          />
        </Section>

        <Section title="INTERACTION">
          <Row
            icon={<Vibrate size={16} color={theme.colors.success} />}
            label="Haptic Feedback"
            noBorder
            right={
              <Switch
                value={config.hapticFeedback}
                onValueChange={setHapticFeedback}
                trackColor={{false: theme.colors.borderSubtle, true: `${theme.colors.success}60`}}
                thumbColor={config.hapticFeedback ? theme.colors.success : theme.colors.textTertiary}
              />
            }
          />
        </Section>

        <Section title="ACCOUNT">
          <Row icon={<ShieldCheck size={16} color={theme.colors.info} />} label="Privacy" />
          <Row icon={<Bell size={16} color={theme.colors.warning} />} label="Notifications" noBorder />
        </Section>

        <Section title="ABOUT">
          <Row icon={<Info size={16} color={theme.colors.textTertiary} />} label="Version 0.1.0-alpha" noBorder right={<Text style={{color: theme.colors.textTertiary, fontSize: 13}}>Alpha</Text>} />
        </Section>

        <TouchableOpacity
          onPress={() => authService.logout()}
          style={[styles.logoutBtn, {borderColor: theme.colors.error}]}>
          <SignOut size={18} color={theme.colors.error} />
          <Text style={[styles.logoutLabel, {color: theme.colors.error}]}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  content: {padding: 16, gap: 20, paddingBottom: 40},
  section: {gap: 8},
  sectionTitle: {fontSize: 11, fontWeight: '700', letterSpacing: 0.8, paddingHorizontal: 4},
  sectionBody: {borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden'},
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 13},
  rowLeft: {flexDirection: 'row', alignItems: 'center', gap: 12},
  rowIcon: {width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center'},
  rowLabel: {fontSize: 15},
  logoutBtn: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, marginTop: 8},
  logoutLabel: {fontSize: 15, fontWeight: '600'},
});
