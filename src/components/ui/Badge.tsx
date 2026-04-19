import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../../hooks/useTheme';

type BadgeVariant = 'accent' | 'success' | 'warning' | 'error' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export default function Badge({label, variant = 'accent', size = 'md', style}: BadgeProps) {
  const theme = useTheme();

  const colors: Record<BadgeVariant, {bg: string; text: string}> = {
    accent: {bg: theme.colors.accentMuted, text: theme.colors.accent},
    success: {bg: `${theme.colors.success}20`, text: theme.colors.success},
    warning: {bg: `${theme.colors.warning}20`, text: theme.colors.warning},
    error: {bg: `${theme.colors.error}20`, text: theme.colors.error},
    neutral: {bg: theme.colors.backgroundTertiary, text: theme.colors.textSecondary},
  };

  return (
    <View
      style={[
        styles.badge,
        {backgroundColor: colors[variant].bg, paddingHorizontal: size === 'sm' ? 6 : 8, paddingVertical: size === 'sm' ? 2 : 4},
        style,
      ]}>
      <Text style={[styles.label, {color: colors[variant].text, fontSize: size === 'sm' ? 11 : 12}]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {borderRadius: 6, alignSelf: 'flex-start'},
  label: {fontWeight: '600'},
});
