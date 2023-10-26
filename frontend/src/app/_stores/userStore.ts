import { create } from "zustand";
import { UserCreateOut } from "../_hooks/createUser";

export type User = {
  user_id?: string | undefined;
  username: string;
  email: string;
  password: string;
  refresh_token?: string | undefined | null;
};

interface UserStore {
  user: User | null;

  actions: {
    setUser: (user: UserCreateOut) => UserCreateOut;
    deleteUser: () => void;
  };
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  actions: {
    setUser: (user): UserCreateOut => {
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
  },
}));
