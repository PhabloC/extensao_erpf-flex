import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  return useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      userName: state.userName,
      userEmail: state.userEmail,
      accessToken: state.accessToken,
      signIn: state.signIn,
      signOut: state.signOut,
    })),
  );
}
