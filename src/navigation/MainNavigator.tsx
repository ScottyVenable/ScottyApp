import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {House, CheckSquare, BookOpen, Wrench, User} from 'phosphor-react-native';
import {View, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MainTabParamList} from './types';
import HomeScreen from '../screens/home/HomeScreen';
import TasksNavigator from './TasksNavigator';
import JournalNavigator from './JournalNavigator';
import ToolsNavigator from './ToolsNavigator';
import ProfileNavigator from './ProfileNavigator';
import {useTheme} from '../hooks/useTheme';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarButton: props => (
          <TouchableOpacity
            {...props}
            activeOpacity={0.7}
            style={[props.style, styles.tabButton]}
          />
        ),
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => <House weight="fill" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksNavigator}
        options={{
          tabBarLabel: 'Tasks',
          tabBarIcon: ({color, size}) => <CheckSquare weight="fill" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalNavigator}
        options={{
          tabBarLabel: 'Journal',
          tabBarIcon: ({color, size}) => <BookOpen weight="fill" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Tools"
        component={ToolsNavigator}
        options={{
          tabBarLabel: 'Tools',
          tabBarIcon: ({color, size}) => <Wrench weight="fill" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => <User weight="fill" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
