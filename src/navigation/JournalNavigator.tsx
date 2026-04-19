import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {JournalStackParamList} from './types';
import JournalListScreen from '../screens/journal/JournalListScreen';
import JournalEditorScreen from '../screens/journal/JournalEditorScreen';
import JournalEntryScreen from '../screens/journal/JournalEntryScreen';

const Stack = createNativeStackNavigator<JournalStackParamList>();

export default function JournalNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="JournalList" component={JournalListScreen} />
      <Stack.Screen name="JournalEditor" component={JournalEditorScreen} />
      <Stack.Screen name="JournalEntry" component={JournalEntryScreen} />
    </Stack.Navigator>
  );
}
