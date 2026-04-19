import type {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Tasks: NavigatorScreenParams<TaskStackParamList>;
  Journal: NavigatorScreenParams<JournalStackParamList>;
  Tools: NavigatorScreenParams<ToolsStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type TaskStackParamList = {
  TaskList: undefined;
  TaskDetail: {id: string};
  TaskCreate: {prefillTitle?: string};
  XPLevel: undefined;
};

export type JournalStackParamList = {
  JournalList: undefined;
  JournalEditor: {id?: string};
  JournalEntry: {id: string};
};

export type ToolsStackParamList = {
  ToolsHub: undefined;
  FocusTimer: undefined;
  HabitList: undefined;
  HabitCreate: undefined;
  HabitDetail: {id: string};
  AudioNotesList: undefined;
  AudioNoteDetail: {id: string};
  MoodTracker: undefined;
  MoodHistory: undefined;
  SnippetList: undefined;
  SnippetCreate: undefined;
  SnippetDetail: {id: string};
  ReadingList: undefined;
  ReadingItem: {id: string};
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  ThemeCreator: undefined;
  BlogFeed: undefined;
  BlogPost: {id: string};
  BlogEditor: {id?: string};
  ConversationList: undefined;
  Chat: {conversationId: string; recipientName: string};
  DevMenu: undefined;
};
