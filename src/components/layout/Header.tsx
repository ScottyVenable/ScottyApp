import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {ArrowLeft} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../hooks/useTheme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export default function Header({title, subtitle, showBack = false, onBack, rightAction, style}: HeaderProps) {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleBack = onBack ?? (() => navigation.goBack());

  return (
    <View style={[styles.container, {borderBottomColor: theme.colors.borderSubtle}, style]}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity onPress={handleBack} style={styles.backBtn} hitSlop={8}>
            <ArrowLeft size={22} color={theme.colors.text} weight="bold" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.center}>
        <Text style={[styles.title, {color: theme.colors.text}]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, {color: theme.colors.textSecondary}]}>{subtitle}</Text>
        )}
      </View>
      <View style={styles.right}>{rightAction ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: {width: 44, alignItems: 'flex-start'},
  center: {flex: 1, alignItems: 'center'},
  right: {width: 44, alignItems: 'flex-end'},
  backBtn: {padding: 4},
  title: {fontSize: 16, fontWeight: '600'},
  subtitle: {fontSize: 12, marginTop: 1},
});
