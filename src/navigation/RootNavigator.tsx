import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import {useAuthStore} from '../store/authStore';
import {authService} from '../services/authService';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const {isAuthenticated, setUser, setLoading} = useAuthStore();

  useEffect(() => {
    setLoading(true);
    authService.getSession().then(session => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          username: (session.user.user_metadata?.username as string) ?? '',
          displayName: (session.user.user_metadata?.display_name as string) ?? '',
          createdAt: session.user.created_at,
          isPublic: true,
          role: 'user',
        });
      } else {
        setLoading(false);
      }
    });

    const {data: {subscription}} = authService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        useAuthStore.getState().logout();
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: 'fade'}}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
