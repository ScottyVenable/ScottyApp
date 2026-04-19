import {create} from 'zustand';
import {AuthState, User} from '../types/user';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  setUser: user => set({user, isAuthenticated: !!user, error: null}),
  setLoading: isLoading => set({isLoading}),
  setError: error => set({error, isLoading: false}),
  logout: () => set({user: null, isAuthenticated: false, error: null}),
}));
