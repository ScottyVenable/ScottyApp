import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import {useTheme} from '../../hooks/useTheme';
import {useHaptic} from '../../hooks/useHaptic';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  fullWidth?: boolean;
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  labelStyle,
  fullWidth = false,
}: ButtonProps) {
  const theme = useTheme();
  const haptic = useHaptic();

  const handlePress = () => {
    haptic('light');
    onPress();
  };

  const containerStyles: ViewStyle[] = [
    styles.base,
    sizes[size],
    fullWidth && styles.fullWidth,
    {
      backgroundColor:
        variant === 'primary' ? theme.colors.accent :
        variant === 'secondary' ? theme.colors.backgroundTertiary :
        variant === 'destructive' ? theme.colors.error :
        'transparent',
      borderWidth: variant === 'secondary' ? 1 : 0,
      borderColor: variant === 'secondary' ? theme.colors.border : 'transparent',
      opacity: disabled || loading ? 0.5 : 1,
    },
    style ?? {},
  ];

  const labelColor =
    variant === 'primary' || variant === 'destructive'
      ? theme.colors.textInverse
      : variant === 'ghost'
      ? theme.colors.accent
      : theme.colors.text;

  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 17 : 15;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={containerStyles}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? theme.colors.textInverse : theme.colors.accent}
          size="small"
        />
      ) : (
        <View style={styles.row}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
          <Text
            style={[
              styles.label,
              {color: labelColor, fontSize, fontWeight: '600'},
              labelStyle,
            ]}>
            {label}
          </Text>
          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    letterSpacing: 0.1,
  },
  iconLeft: {marginRight: 6},
  iconRight: {marginLeft: 6},
});

const sizes: Record<Size, ViewStyle> = {
  sm: {paddingHorizontal: 12, paddingVertical: 7, minHeight: 32},
  md: {paddingHorizontal: 20, paddingVertical: 12, minHeight: 44},
  lg: {paddingHorizontal: 24, paddingVertical: 15, minHeight: 52},
};
