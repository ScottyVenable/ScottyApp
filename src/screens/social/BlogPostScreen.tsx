import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Markdown from 'react-native-markdown-display';
import {useTheme} from '../../hooks/useTheme';
import Header from '../../components/layout/Header';

export default function BlogPostScreen() {
  const theme = useTheme();
  const mdStyles = {
    body: {color: theme.colors.text, fontSize: 15, lineHeight: 24},
    heading1: {color: theme.colors.text, fontWeight: '700' as const, fontSize: 22},
    link: {color: theme.colors.accent},
  };
  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <Header title="Post" showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, {color: theme.colors.text}]}>Getting organized with ScottyApp</Text>
        <Text style={[styles.meta, {color: theme.colors.textTertiary}]}>By Scotty · 3 min read</Text>
        <Markdown style={mdStyles as any}>
          {`Today I want to share how I have been using my new multi-tool app to stay organized. With ADHD it can be really hard to keep track of everything...\n\n## What works for me\n\nThe gamified task list has been a game changer. Earning XP for completing tasks actually motivates me to get things done.`}
        </Markdown>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  content: {padding: 20, gap: 12},
  title: {fontSize: 24, fontWeight: '700', lineHeight: 32},
  meta: {fontSize: 13},
});
