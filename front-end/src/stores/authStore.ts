import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  userName: string | null;
  userEmail: string | null;
  accessToken: string | null;
  signIn: (session: { userName: string; userEmail: string; accessToken: string }) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set) => ({
    isAuthenticated: false,
    userName: null,
    userEmail: null,
    accessToken: null,
    signIn: ({ accessToken, userEmail, userName }) => {
      set({
        isAuthenticated: true,
        userName,
        userEmail,
        accessToken,
      });
    },
    signOut: () => {
      set({
        isAuthenticated: false,
        userName: null,
        userEmail: null,
        accessToken: null,
      });
    },
  })),
);
