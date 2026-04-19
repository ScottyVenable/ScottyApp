import React, {useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import {useThemeStore} from './src/store/themeStore';
import {useDevStore} from './src/store/devStore';

export default function App() {
  const {loadFromStorage} = useThemeStore();
  const {loadDevMode} = useDevStore();

  useEffect(() => {
    loadFromStorage();
    loadDevMode();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
});
