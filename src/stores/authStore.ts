import { create } from 'zustand';
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  register: async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user's profile with their name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
        // Update the store with the updated user
        set({ user: auth.currentUser });
      }
    } catch (error) {
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Ensure we have the latest user data
      set({ user: userCredential.user });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error) {
      throw error;
    }
  },
}));

// Set up the auth state listener
onAuthStateChanged(auth, (user) => {
  useAuthStore.getState().setUser(user);
  useAuthStore.getState().setLoading(false);
});
