import React, {forwardRef, useState} from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import {Eye, EyeSlash} from 'phosphor-react-native';
import {useTheme} from '../../hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

const Input = forwardRef<TextInput, InputProps>(
  ({label, error, hint, leftIcon, rightIcon, containerStyle, isPassword, style, ...props}, ref) => {
    const theme = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const borderColor = error
      ? theme.colors.error
      : isFocused
      ? theme.colors.accent
      : theme.colors.border;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, {color: theme.colors.textSecondary, fontSize: 13}]}>
            {label}
          </Text>
        )}
        <View
          style={[
            styles.inputWrapper,
            {
              borderColor,
              borderWidth: isFocused ? 1.5 : 1,
              backgroundColor: theme.colors.backgroundSecondary,
              borderRadius: 10,
            },
          ]}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              {
                color: theme.colors.text,
                flex: 1,
                paddingHorizontal: leftIcon ? 4 : 14,
                fontSize: 15,
              },
              style,
            ]}
            placeholderTextColor={theme.colors.textTertiary}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            secureTextEntry={isPassword && !showPassword}
            {...props}
          />
          {isPassword ? (
            <TouchableOpacity
              style={styles.rightIcon}
              onPress={() => setShowPassword(v => !v)}>
              {showPassword ? (
                <EyeSlash size={18} color={theme.colors.textTertiary} />
              ) : (
                <Eye size={18} color={theme.colors.textTertiary} />
              )}
            </TouchableOpacity>
          ) : (
            rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>
          )}
        </View>
        {error && (
          <Text style={[styles.error, {color: theme.colors.error, fontSize: 12}]}>{error}</Text>
        )}
        {hint && !error && (
          <Text style={[styles.hint, {color: theme.colors.textTertiary, fontSize: 12}]}>
            {hint}
          </Text>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';
export default Input;

const styles = StyleSheet.create({
  container: {gap: 6},
  label: {fontWeight: '500'},
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  input: {paddingVertical: 10},
  leftIcon: {paddingLeft: 12},
  rightIcon: {paddingRight: 12},
  error: {marginTop: 2},
  hint: {marginTop: 2},
});
