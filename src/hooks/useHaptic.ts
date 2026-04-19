import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {useThemeConfig} from './useTheme';

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export function useHaptic() {
  const config = useThemeConfig();

  return (type: HapticType = 'light') => {
    if (!config.hapticFeedback) return;
    const map: Record<HapticType, string> = {
      light: 'impactLight',
      medium: 'impactMedium',
      heavy: 'impactHeavy',
      success: 'notificationSuccess',
      warning: 'notificationWarning',
      error: 'notificationError',
    };
    ReactNativeHapticFeedback.trigger(map[type] as never, {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  };
}
