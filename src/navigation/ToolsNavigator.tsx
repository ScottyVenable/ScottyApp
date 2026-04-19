import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ToolsStackParamList} from './types';
import ToolsHubScreen from '../screens/tools/ToolsHubScreen';
import FocusTimerScreen from '../screens/focus/FocusTimerScreen';
import HabitListScreen from '../screens/habits/HabitListScreen';
import HabitCreateScreen from '../screens/habits/HabitCreateScreen';
import HabitDetailScreen from '../screens/habits/HabitDetailScreen';
import AudioNotesListScreen from '../screens/audio/AudioNotesListScreen';
import AudioNoteDetailScreen from '../screens/audio/AudioNoteDetailScreen';
import MoodTrackerScreen from '../screens/mood/MoodTrackerScreen';
import MoodHistoryScreen from '../screens/mood/MoodHistoryScreen';
import SnippetListScreen from '../screens/snippets/SnippetListScreen';
import SnippetCreateScreen from '../screens/snippets/SnippetCreateScreen';
import SnippetDetailScreen from '../screens/snippets/SnippetDetailScreen';
import ReadingListScreen from '../screens/reading/ReadingListScreen';
import ReadingItemScreen from '../screens/reading/ReadingItemScreen';

const Stack = createNativeStackNavigator<ToolsStackParamList>();

export default function ToolsNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ToolsHub" component={ToolsHubScreen} />
      <Stack.Screen name="FocusTimer" component={FocusTimerScreen} />
      <Stack.Screen name="HabitList" component={HabitListScreen} />
      <Stack.Screen name="HabitCreate" component={HabitCreateScreen} />
      <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
      <Stack.Screen name="AudioNotesList" component={AudioNotesListScreen} />
      <Stack.Screen name="AudioNoteDetail" component={AudioNoteDetailScreen} />
      <Stack.Screen name="MoodTracker" component={MoodTrackerScreen} />
      <Stack.Screen name="MoodHistory" component={MoodHistoryScreen} />
      <Stack.Screen name="SnippetList" component={SnippetListScreen} />
      <Stack.Screen name="SnippetCreate" component={SnippetCreateScreen} />
      <Stack.Screen name="SnippetDetail" component={SnippetDetailScreen} />
      <Stack.Screen name="ReadingList" component={ReadingListScreen} />
      <Stack.Screen name="ReadingItem" component={ReadingItemScreen} />
    </Stack.Navigator>
  );
}
