import React from 'react';
import {View, StyleSheet, ViewStyle, TouchableOpacity} from 'react-native';
import {useTheme} from '../../hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  onPress?: () => void;
  padding?: number;
}

export default function Card({children, style, elevated = false, onPress, padding = 16}: CardProps) {
  const theme = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: elevated ? theme.colors.surfaceElevated : theme.colors.surface,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    padding,
    ...(elevated ? theme.shadows.md : {}),
  };

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={[cardStyle, style]}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
}
