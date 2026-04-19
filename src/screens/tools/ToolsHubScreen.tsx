import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {
  Timer,
  Heartbeat,
  Microphone,
  SmileyWink,
  Code,
  BookBookmark,
} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../hooks/useTheme';

interface Tool {
  label: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
}

export default function ToolsHubScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const tools: Tool[] = [
    {label: 'Focus Timer', description: 'Pomodoro sessions', icon: <Timer size={28} weight="fill" />, route: 'FocusTimer', color: '#7C3AED'},
    {label: 'Habits', description: 'Track daily habits', icon: <Heartbeat size={28} weight="fill" />, route: 'HabitList', color: '#16A34A'},
    {label: 'Audio Notes', description: 'Voice recordings', icon: <Microphone size={28} weight="fill" />, route: 'AudioNotesList', color: '#2563EB'},
    {label: 'Mood', description: 'Daily check-ins', icon: <SmileyWink size={28} weight="fill" />, route: 'MoodTracker', color: '#D97706'},
    {label: 'Snippets', description: 'Code snippets', icon: <Code size={28} weight="fill" />, route: 'SnippetList', color: '#0891B2'},
    {label: 'Reading List', description: 'Save for later', icon: <BookBookmark size={28} weight="fill" />, route: 'ReadingList', color: '#DB2777'},
  ];

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {borderBottomColor: theme.colors.borderSubtle}]}>
        <Text style={[styles.title, {color: theme.colors.text}]}>Tools</Text>
      </View>
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {tools.map(tool => (
          <TouchableOpacity
            key={tool.route}
            onPress={() => navigation.navigate(tool.route)}
            activeOpacity={0.75}
            style={[styles.toolCard, {backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border}]}>
            <View style={[styles.toolIcon, {backgroundColor: `${tool.color}18`}]}>
              {React.cloneElement(tool.icon as React.ReactElement, {color: tool.color})}
            </View>
            <Text style={[styles.toolLabel, {color: theme.colors.text}]}>{tool.label}</Text>
            <Text style={[styles.toolDesc, {color: theme.colors.textTertiary}]}>{tool.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  header: {paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth},
  title: {fontSize: 24, fontWeight: '700'},
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  toolCard: {
    width: '47%',
    padding: 18,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  toolIcon: {width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center'},
  toolLabel: {fontSize: 15, fontWeight: '700'},
  toolDesc: {fontSize: 12, lineHeight: 17},
});
