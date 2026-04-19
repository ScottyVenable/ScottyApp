import {supabase} from './supabase';
import {useAuthStore} from '../store/authStore';
import {logger} from './errorService';

export const authService = {
  async login(email: string, password: string) {
    useAuthStore.getState().setLoading(true);
    const {data, error} = await supabase.auth.signInWithPassword({email, password});
    if (error) {
      useAuthStore.getState().setError(error.message);
      throw error;
    }
    if (data.user) {
      useAuthStore.getState().setUser({
        id: data.user.id,
        email: data.user.email ?? '',
        username: (data.user.user_metadata?.username as string) ?? '',
        displayName: (data.user.user_metadata?.display_name as string) ?? '',
        avatarUrl: data.user.user_metadata?.avatar_url as string | undefined,
        bio: data.user.user_metadata?.bio as string | undefined,
        createdAt: data.user.created_at,
        isPublic: true,
        role: 'user',
      });
    }
    return data;
  },

  async signup(email: string, password: string, username: string) {
    useAuthStore.getState().setLoading(true);
    const {data, error} = await supabase.auth.signUp({
      email,
      password,
      options: {data: {username, display_name: username}},
    });
    if (error) {
      useAuthStore.getState().setError(error.message);
      throw error;
    }
    return data;
  },

  async logout() {
    await supabase.auth.signOut();
    useAuthStore.getState().logout();
    logger.info('User logged out', 'auth');
  },

  async getSession() {
    const {data} = await supabase.auth.getSession();
    return data.session;
  },

  onAuthStateChange(callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
