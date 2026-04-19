import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useTheme} from '../../hooks/useTheme';
import Button from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({icon, title, description, actionLabel, onAction}: EmptyStateProps) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, {backgroundColor: theme.colors.backgroundTertiary}]}>
        {icon}
      </View>
      <Text style={[styles.title, {color: theme.colors.text}]}>{title}</Text>
      {description && (
        <Text style={[styles.description, {color: theme.colors.textSecondary}]}>{description}</Text>
      )}
      {actionLabel && onAction && (
        <Button label={actionLabel} onPress={onAction} style={styles.action} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12},
  iconWrapper: {width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center'},
  title: {fontSize: 17, fontWeight: '600', textAlign: 'center'},
  description: {fontSize: 14, textAlign: 'center', lineHeight: 20},
  action: {marginTop: 8},
});
