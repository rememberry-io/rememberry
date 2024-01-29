import { create } from "zustand";
import { RegisterUserOutput } from "./useRegisterUser";

export type User = {
  id: string;
  username: string;
  email: string;
};

interface UserStore {
  user: User | null;

  isLoading: boolean;

  isLoggedIn: boolean;

  actions: {
    setUser: (user: RegisterUserOutput) => RegisterUserOutput;
    deleteUser: () => void;
    setLoading: (loading: boolean) => void;
    setLoggedIn: (loggedIn: boolean) => void;
  };
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  isLoggedIn: false,
  actions: {
    setUser: (user): RegisterUserOutput => {
      set(() => ({
        user: user,
      }));
      return user;
    },
    deleteUser() {
      set(() => ({
        user: null,
      }));
    },
    setLoading(loading) {
      set(() => ({
        isLoading: loading,
      }));
    },
    setLoggedIn(loggedIn) {
      set(() => ({
        isLoggedIn: loggedIn,
      }));
    },
  },
}));
