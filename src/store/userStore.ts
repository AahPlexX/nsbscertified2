
import { create } from 'zustand';

interface UserState {
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  userRole: 'ADMIN' | 'STUDENT' | null;
  isAuthenticated: boolean;
  session: {
    token?: string;
    expires?: Date;
  } | null;

  setUser: (data: {
    userId: string;
    userName: string;
    userEmail: string;
    userRole: 'ADMIN' | 'STUDENT';
  }) => void;
  clearUser: () => void;
  setSession: (session: UserState['session']) => void;
  setIsAuthenticated: (status: boolean) => void;
  getUserRole: () => UserState['userRole'];
  getIsAuthenticated: () => boolean;
}

const initialState = {
  userId: null,
  userName: null,
  userEmail: null,
  userRole: null,
  isAuthenticated: false,
  session: null,
};

export const useUserStore = create<UserState>((set, get) => ({
  ...initialState,

  setUser: ({ userId, userName, userEmail, userRole }) => {
    set({
      userId,
      userName,
      userEmail,
      userRole,
      isAuthenticated: true,
    });
  },

  clearUser: () => {
    set(initialState);
  },

  setSession: (session) => {
    set({ session });
  },

  setIsAuthenticated: (status) => {
    set({ isAuthenticated: status });
  },

  getUserRole: () => get().userRole,

  getIsAuthenticated: () => get().isAuthenticated,
}));
