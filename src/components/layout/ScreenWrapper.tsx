import React from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  StyleSheet,
  ViewStyle,
  StatusBar,
} from 'react-native';
import {useTheme} from '../../hooks/useTheme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  keyboardAvoiding?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export default function ScreenWrapper({
  children,
  scrollable = false,
  style,
  contentStyle,
  keyboardAvoiding = true,
}: ScreenWrapperProps) {
  const theme = useTheme();

  const content = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView
      style={[styles.safe, {backgroundColor: theme.colors.background}, style]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  flex: {flex: 1},
  content: {flex: 1},
  scroll: {flex: 1},
  scrollContent: {flexGrow: 1},
});
