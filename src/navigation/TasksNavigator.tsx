import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TaskStackParamList} from './types';
import TaskListScreen from '../screens/tasks/TaskListScreen';
import TaskDetailScreen from '../screens/tasks/TaskDetailScreen';
import TaskCreateScreen from '../screens/tasks/TaskCreateScreen';
import XPLevelScreen from '../screens/tasks/XPLevelScreen';

const Stack = createNativeStackNavigator<TaskStackParamList>();

export default function TasksNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="TaskList" component={TaskListScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
      <Stack.Screen name="TaskCreate" component={TaskCreateScreen} />
      <Stack.Screen name="XPLevel" component={XPLevelScreen} />
    </Stack.Navigator>
  );
}
