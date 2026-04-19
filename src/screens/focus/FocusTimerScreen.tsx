import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {ArrowLeft, Play, Pause, ArrowCounterClockwise, SkipForward, Timer} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Animated, {useAnimatedStyle, useSharedValue, withTiming, Easing} from 'react-native-reanimated';
import {useTheme} from '../../hooks/useTheme';
import {useFocusStore} from '../../store/focusStore';
import {useHaptic} from '../../hooks/useHaptic';

const MODE_LABELS = {focus: 'Focus', shortBreak: 'Short Break', longBreak: 'Long Break'};
const MODE_COLORS = {
  focus: '#7C3AED',
  shortBreak: '#16A34A',
  longBreak: '#2563EB',
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function FocusTimerScreen() {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const haptic = useHaptic();
  const {config, mode, status, timeRemaining, sessionsCompleted, todayFocusMinutes, loadData, startTimer, pauseTimer, resetTimer, tick, switchMode} = useFocusStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modeColor = MODE_COLORS[mode];
  const totalDuration = mode === 'focus' ? config.focusDuration : mode === 'shortBreak' ? config.shortBreakDuration : config.longBreakDuration;
  const progress = 1 - timeRemaining / totalDuration;

  const ring = useSharedValue(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    ring.value = withTiming(progress, {duration: 500, easing: Easing.out(Easing.cubic)});
  }, [progress]);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => tick(), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  useEffect(() => {
    if (status === 'completed') {
      haptic('success');
    }
  }, [status]);

  const SIZE = 240;
  const STROKE = 12;
  const R = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * R;

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {borderBottomColor: theme.colors.border}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={22} color={theme.colors.text} weight="bold" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>Focus Timer</Text>
        <View style={{width: 22}} />
      </View>

      <View style={styles.content}>
        {/* Mode Selector */}
        <View style={[styles.modeRow, {backgroundColor: theme.colors.backgroundSecondary, borderRadius: 12}]}>
          {(['focus', 'shortBreak', 'longBreak'] as const).map(m => (
            <TouchableOpacity
              key={m}
              onPress={() => switchMode(m)}
              style={[styles.modeBtn, mode === m && {backgroundColor: modeColor}]}>
              <Text style={[styles.modeBtnLabel, {color: mode === m ? '#fff' : theme.colors.textSecondary}]}>
                {MODE_LABELS[m]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Timer Ring */}
        <View style={styles.timerWrapper}>
          <View style={[styles.timerRing, {width: SIZE, height: SIZE}]}>
            {/* Background track */}
            <View style={[StyleSheet.absoluteFillObject, {borderRadius: SIZE / 2, borderWidth: STROKE, borderColor: theme.colors.backgroundTertiary}]} />
            {/* Progress (CSS-style overlay using opacity trick) */}
            <View style={[StyleSheet.absoluteFillObject, {alignItems: 'center', justifyContent: 'center'}]}>
              <Text style={[styles.timerText, {color: theme.colors.text}]}>{formatTime(timeRemaining)}</Text>
              <Text style={[styles.modeLabel, {color: modeColor}]}>{MODE_LABELS[mode]}</Text>
              {status === 'completed' && (
                <Text style={[styles.completedLabel, {color: theme.colors.success}]}>Done!</Text>
              )}
            </View>
          </View>
        </View>

        {/* Session indicator */}
        <View style={styles.sessionsRow}>
          {Array.from({length: config.sessionsUntilLongBreak}).map((_, i) => (
            <View
              key={i}
              style={[
                styles.sessionDot,
                {backgroundColor: i < (sessionsCompleted % config.sessionsUntilLongBreak) ? modeColor : theme.colors.border},
              ]}
            />
          ))}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={resetTimer} style={[styles.controlBtn, {backgroundColor: theme.colors.backgroundTertiary}]} hitSlop={8}>
            <ArrowCounterClockwise size={22} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              haptic('medium');
              status === 'running' ? pauseTimer() : startTimer();
            }}
            style={[styles.mainBtn, {backgroundColor: modeColor}]}>
            {status === 'running' ? (
              <Pause size={28} color="#fff" weight="fill" />
            ) : (
              <Play size={28} color="#fff" weight="fill" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              const next = mode === 'focus' ? 'shortBreak' : 'focus';
              switchMode(next);
            }}
            style={[styles.controlBtn, {backgroundColor: theme.colors.backgroundTertiary}]}
            hitSlop={8}>
            <SkipForward size={22} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Timer size={16} color={theme.colors.textTertiary} />
            <Text style={[styles.statValue, {color: theme.colors.text}]}>{todayFocusMinutes}m</Text>
            <Text style={[styles.statLabel, {color: theme.colors.textTertiary}]}>today</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, {color: theme.colors.text}]}>{sessionsCompleted}</Text>
            <Text style={[styles.statLabel, {color: theme.colors.textTertiary}]}>sessions</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth},
  headerTitle: {fontSize: 16, fontWeight: '600'},
  content: {flex: 1, alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: 24, paddingVertical: 20},
  modeRow: {flexDirection: 'row', padding: 4, gap: 2},
  modeBtn: {flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center'},
  modeBtnLabel: {fontSize: 12, fontWeight: '600'},
  timerWrapper: {alignItems: 'center', justifyContent: 'center'},
  timerRing: {alignItems: 'center', justifyContent: 'center'},
  timerText: {fontSize: 52, fontWeight: '700', fontVariant: ['tabular-nums']},
  modeLabel: {fontSize: 14, fontWeight: '600', marginTop: 4},
  completedLabel: {fontSize: 13, fontWeight: '600', marginTop: 4},
  sessionsRow: {flexDirection: 'row', gap: 8},
  sessionDot: {width: 10, height: 10, borderRadius: 5},
  controls: {flexDirection: 'row', alignItems: 'center', gap: 24},
  controlBtn: {width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center'},
  mainBtn: {width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center'},
  statsRow: {flexDirection: 'row', gap: 32},
  stat: {alignItems: 'center', gap: 2},
  statValue: {fontSize: 20, fontWeight: '700'},
  statLabel: {fontSize: 12},
});
