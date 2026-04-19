import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, ViewStyle} from 'react-native';
import {useTheme} from '../../hooks/useTheme';

interface ProgressBarProps {
  progress: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  animated?: boolean;
}

export default function ProgressBar({
  progress,
  height = 6,
  color,
  backgroundColor,
  style,
  animated = true,
}: ProgressBarProps) {
  const theme = useTheme();
  const width = useRef(new Animated.Value(0)).current;
  const clampedProgress = Math.max(0, Math.min(1, progress));

  useEffect(() => {
    if (animated) {
      Animated.spring(width, {
        toValue: clampedProgress * 100,
        useNativeDriver: false,
        tension: 60,
        friction: 10,
      }).start();
    } else {
      width.setValue(clampedProgress * 100);
    }
  }, [clampedProgress, animated, width]);

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius: height / 2,
          backgroundColor: backgroundColor ?? theme.colors.backgroundTertiary,
        },
        style,
      ]}>
      <Animated.View
        style={[
          styles.fill,
          {
            height,
            borderRadius: height / 2,
            backgroundColor: color ?? theme.colors.accent,
            width: width.interpolate({inputRange: [0, 100], outputRange: ['0%', '100%']}),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {overflow: 'hidden', width: '100%'},
  fill: {},
});
