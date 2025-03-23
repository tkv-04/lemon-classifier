import { create } from 'zustand';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import type { AuthStore, User } from '../types';

// In a real app, these would be stored securely in a database

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user: User = {
        username: userCredential.user.email || '',
        isAuthenticated: true,
      };
      set({ user });
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  },
  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));