import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ProfileStackParamList} from './types';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ThemeCreatorScreen from '../screens/settings/ThemeCreatorScreen';
import BlogFeedScreen from '../screens/social/BlogFeedScreen';
import BlogPostScreen from '../screens/social/BlogPostScreen';
import BlogEditorScreen from '../screens/social/BlogEditorScreen';
import ConversationListScreen from '../screens/social/ConversationListScreen';
import ChatScreen from '../screens/social/ChatScreen';
import DevMenuScreen from '../screens/dev/DevMenuScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ThemeCreator" component={ThemeCreatorScreen} />
      <Stack.Screen name="BlogFeed" component={BlogFeedScreen} />
      <Stack.Screen name="BlogPost" component={BlogPostScreen} />
      <Stack.Screen name="BlogEditor" component={BlogEditorScreen} />
      <Stack.Screen name="ConversationList" component={ConversationListScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="DevMenu" component={DevMenuScreen} />
    </Stack.Navigator>
  );
}
